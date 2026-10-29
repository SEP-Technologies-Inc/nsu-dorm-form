import { z } from 'zod';
import { isDateRangeWithinAcademicPeriod } from './applicationForm.dateRange.ts';

const normalizeText = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

const normalizedString = z.string().transform(normalizeText);

export const applicationFormSchema = z
  .object({
    faculty: normalizedString.refine(Boolean, 'Выберите факультет.'),
    course: z.union([z.literal(''), z.number()]).refine((course) => {
      return typeof course === 'number' && Number.isInteger(course) && course >= 1 && course <= 6;
    }, 'Укажите курс.'),
    name: normalizedString.refine((name) => name.length >= 2, 'Укажите ваше ФИО.'),
    group: normalizedString
      .refine(Boolean, 'Укажите вашу группу.')
      .refine((group) => group.length <= 10, 'Номер группы не может быть длиннее 10 символов.'),
    dormitory: normalizedString.refine(Boolean, 'Выберите общежитие.'),
    room: normalizedString.refine(
      (value) => value.length <= 10,
      'Номер комнаты не может быть длиннее 10 символов.',
    ),
    tel: normalizedString.refine((phone) => {
      const digits = phone.replace(/\D/g, '');
      const phoneHasValidCharacters = /^\+?[\d\s()-]+$/.test(phone);

      return phoneHasValidCharacters && digits.length >= 7 && digits.length <= 15;
    }, 'Укажите корректный номер телефона'),
    guest: normalizedString.refine((value) => value.length >= 2, 'Укажите ФИО гостя'),
    relationship: normalizedString.refine(
      (value) => value.length <= 60,
      'Степень родства не может быть длиннее 60 символов.',
    ),
    start: normalizedString.refine(Boolean, 'Укажите дату начала приглашения'),
    end: normalizedString.refine(Boolean, 'Укажите дату окончания приглашения'),
    roommates: z.array(
      normalizedString.refine(
        (roommate) => roommate === '' || roommate.length >= 2,
        'Укажите ФИО соседей.',
      ),
    ),
    overbureaucracy: z.boolean(),
  })
  .superRefine((data, context) => {
    if (!data.start || !data.end) {
      return;
    }

    if (data.end < data.start) {
      context.addIssue({
        code: 'custom',
        path: ['end'],
        message: 'Дата окончания не может быть раньше даты начала',
      });

      return;
    }

    if (!isDateRangeWithinAcademicPeriod(data.start, data.end)) {
      context.addIssue({
        code: 'custom',
        path: ['end'],
        message: 'Период не должен выходить за границы одного семестра или летнего периода.',
      });
    }
  });
