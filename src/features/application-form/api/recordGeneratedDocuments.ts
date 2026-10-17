export async function recordGeneratedDocuments(documentsCount: number): Promise<void> {
  const endpoint = import.meta.env.VITE_STATS_ENDPOINT;

  if (!endpoint) {
    return;
  }

  if (!Number.isInteger(documentsCount) || documentsCount < 1 || documentsCount > 60) {
    throw new Error('Некорректное число документов');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: crypto.randomUUID(),
      documentsCount,
    }),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`Сервер статистики вернул ${response.status}`);
  }
}
