import type {ApplicationFormData} from "../types/ApplicationFormData.ts";
import type {ApplicationFormErrors} from "../types/ApplicationFormErrors.ts";
import {isDateRangeWithinAcademicPeriod} from "./applicationForm.dateRange.ts";

function normalizeText(value: string) {
    return value.trim().replace(/\s+/g, ' ');
}

export function normalizeApplicationFormData(data: ApplicationFormData): ApplicationFormData {
    return {
        ...data,
        faculty: normalizeText(data.faculty),
        name: normalizeText(data.name),
        group: normalizeText(data.group),
        dormitory: normalizeText(data.dormitory),
        room: normalizeText(data.room),
        tel: normalizeText(data.tel),
        guest: normalizeText(data.guest),
        relationship: normalizeText(data.relationship),
        roommates: data.roommates.map(normalizeText).filter(Boolean),
    };
}

export function validateApplicationForm(data: ApplicationFormData): ApplicationFormErrors {
    const normalized = normalizeApplicationFormData(data);
    const errors: ApplicationFormErrors = {};

    if (!normalized.faculty) {
        errors.faculty = 'Выберите факультет.';
    }

    if (normalized.course === '' || !Number.isInteger(normalized.course) || normalized.course < 1 || normalized.course > 6) {
        errors.course = 'Укажите курс.';
    }

    if (normalized.name.length < 2) {
        errors.name = 'Укажите ваше ФИО.';
    }

    if (!normalized.group) {
        errors.group = 'Укажите вашу группу.';
    } else if (normalized.group.length > 10) {
        errors.group = 'Номер группы не может быть длиннее 10 символов.';
    }

    if (!normalized.dormitory) {
        errors.dormitory = 'Выберите общежитие.';
    }

    if (normalized.room.length > 10) {
        errors.room = 'Номер комнаты не может быть длиннее 10 символов.';
    }

    const phoneDigits = normalized.tel.replace(/\D/g, '');
    const phoneHasValidCharacters = /^\+?[\d\s()-]+$/.test(normalized.tel);

    if (!phoneHasValidCharacters || phoneDigits.length < 7 || phoneDigits.length > 15) {
        errors.tel = 'Укажите корректный номер телефона';
    }

    if (normalized.relationship.length > 60) {
        errors.relationship = 'Степень родства не может быть длиннее 60 символов.';
    }

    if (normalized.guest.length < 2) {
        errors.guest = 'Укажите ФИО гостя.';
    }

    if (!normalized.start) {
        errors.start = 'Укажите дату начала приглашения';
    }

    if (!normalized.end) {
        errors.end = 'Укажите дату окончания приглашения.';
    } else if (normalized.start && normalized.end < normalized.start) {
        errors.end = 'Дата окончания не может быть раньше даты начала';
    } else if (
        normalized.start &&
        !isDateRangeWithinAcademicPeriod(normalized.start, normalized.end)
    ) {
        errors.end = 'Период не должен выходить за границы одного семестра или летнего периода.';
    }

    const invalidRoommate = normalized.roommates.some((roommate) => roommate.length < 2);

    if (invalidRoommate) {
        errors.roommates = 'Укажите ФИО соседей';
    }

    return errors;
}
