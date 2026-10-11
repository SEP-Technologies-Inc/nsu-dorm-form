import logging
import os
from collections import deque
from threading import Lock
from time import monotonic
from uuid import UUID

import mysql.connector
from fastapi import FastAPI, HTTPException, Request, Response, status
from pydantic import BaseModel, ConfigDict, Field

logger = logging.getLogger(__name__)

ALLOWED_ORIGIN = os.environ.get(
    "ALLOWED_ORIGIN",
    "https://dorm.sepcode.eu",
)

RATE_LIMIT = 60
RATE_LIMIT_WINDOW = 60.0

request_times: dict[str, deque[float]] = {}
rate_limit_lock = Lock()

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


class GenerationEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    eventId: UUID
    documentsCount: int = Field(ge=1, le=60)


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")

    if forwarded_for:
        return forwarded_for.split(",", maxsplit=1)[0].strip()

    if request.client:
        return request.client.host

    return "unknown"


def check_rate_limit(client_ip: str) -> None:
    now = monotonic()
    oldest_allowed = now - RATE_LIMIT_WINDOW

    with rate_limit_lock:
        times = request_times.setdefault(client_ip, deque())

        while times and times[0] < oldest_allowed:
            times.popleft()

        if len(times) >= RATE_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests",
                headers={"Retry-After": "60"},
            )

        times.append(now)

        if len(request_times) > 10_000:
            for ip, saved_times in list(request_times.items()):
                while saved_times and saved_times[0] < oldest_allowed:
                    saved_times.popleft()

                if not saved_times:
                    del request_times[ip]


def get_db_connection():
    return mysql.connector.connect(
        host=os.environ["DB_HOST"],
        port=int(os.environ.get("DB_PORT", "3306")),
        database=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        connection_timeout=5,
    )


@app.post(
    "/api/stats/generations",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def record_generation(
    event: GenerationEvent,
    request: Request,
) -> Response:
    if request.headers.get("origin") != ALLOWED_ORIGIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Origin is not allowed",
        )

    check_rate_limit(get_client_ip(request))

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT IGNORE INTO generation_events (
                event_id,
                documents_count
            )
            VALUES (%s, %s)
            """,
            (
                str(event.eventId),
                event.documentsCount,
            ),
        )

        connection.commit()

    except mysql.connector.Error as error:
        logger.exception("Could not record generation event")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Statistics service is unavailable",
        ) from error

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()

    return Response(status_code=status.HTTP_204_NO_CONTENT)