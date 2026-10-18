import { lazy, Suspense, type ChangeEvent, type FormEvent, useState } from 'react';
import type { ApplicationFormData } from '@/features/application-form/types/ApplicationFormData';
import { faculties } from '@/features/application-form/constants/applicationForm.constants.ts';
import {
  normalizeApplicationFormData,
  validateApplicationForm,
} from '@/features/application-form/lib/applicationForm.validation.ts';
import type { ApplicationFormErrors } from '@/features/application-form/types/ApplicationFormErrors.ts';
import { FieldError } from '@/features/application-form/components/FieldError/FieldError.tsx';
import { PDFErrorBoundary, loadDownloadPdfButton } from '@/features/pdf-generation';
import { dormitoryAddress } from '@/features/application-form/constants/dormitoryAddress.constants.ts';
import { splitDateRange } from '@/features/application-form/lib/applicationForm.dateRange.ts';
import styles from './ApplicationForm.module.css';
import { recordGeneratedDocuments } from '@/features/application-form/api/recordGeneratedDocuments.ts';

const initialFormData: ApplicationFormData = {
  faculty: '',
  course: '',
  name: '',
  group: '',
  dormitory: '',
  room: '',
  tel: '',
  guest: '',
  relationship: '',
  start: '',
  end: '',
  roommates: ['', '', ''],
  overbureaucracy: false,
};

const DownloadPdfButton = lazy(loadDownloadPdfButton);

export function ApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [errors, setErrors] = useState<ApplicationFormErrors>({});
  const [PDFData, setPDFData] = useState<ApplicationFormData[] | null>(null);

  function clearError(name: keyof ApplicationFormErrors) {
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setPDFData(null);
    const target = event.currentTarget;
    let value: string | number | boolean = target.value;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      value = target.checked;
    }
    if (target.name === 'course') {
      value = target.value === '' ? '' : Number(target.value);
    }
    setFormData((current) => ({
      ...current,
      [target.name]: value,
    }));
    if (target.name !== 'overbureaucracy') {
      clearError(target.name as keyof ApplicationFormErrors);
    }
  }

  function handleRoommateChange(index: number, value: string) {
    setPDFData(null);
    setFormData((current) => ({
      ...current,
      roommates: current.roommates.map((roommate, roommateIndex) =>
        roommateIndex === index ? value : roommate,
      ),
    }));
    clearError('roommates');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedData = normalizeApplicationFormData(formData);
    const validationErrors = validateApplicationForm(normalizedData);
    setErrors(validationErrors);

    const firstErrorName = Object.keys(validationErrors)[0];

    if (firstErrorName) {
      let fieldName = firstErrorName;

      if (firstErrorName === 'roommates') {
        const invalidRoommateIndex = formData.roommates.findIndex((roommate) => {
          const normalizedRoommate = roommate.trim().replace(/\s+/g, ' ');
          return normalizedRoommate.length > 0 && normalizedRoommate.length < 2;
        });

        fieldName =
          invalidRoommateIndex >= 0 ? `roommate-${invalidRoommateIndex + 1}` : 'roommate-1';
      }

      const field = event.currentTarget.elements.namedItem(fieldName);

      if (field instanceof HTMLElement) {
        field.focus();
      }

      return;
    }

    const ranges = normalizedData.overbureaucracy
      ? splitDateRange(normalizedData.start, normalizedData.end)
      : [{ start: normalizedData.start, end: normalizedData.end }];

    const docs = ranges.map((range) => ({
      ...normalizedData,
      start: range.start,
      end: range.end,
    }));

    setPDFData(docs);
    void recordGeneratedDocuments(docs.length).catch((error: unknown) => {
      console.error('Failed to record generation statistics:', error);
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h1 className={styles.header}>Заполните заявление на приглашение в общежитие</h1>
      <p className={styles.requiredHint}>
        <span aria-hidden="true">*</span> — обязательные поля
      </p>
      <fieldset>
        <legend>Данные студента</legend>

        <div className={styles.inputBlock}>
          <label htmlFor="faculty">
            Факультет{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <select
            id="faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            aria-invalid={Boolean(errors.faculty)}
            aria-describedby={errors.faculty ? 'faculty-error' : undefined}
            required
          >
            <option value="" disabled>
              Выберите факультет
            </option>
            {faculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
          <FieldError id="faculty-error" message={errors.faculty} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="course">
            Курс обучения{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="course"
            type="number"
            name="course"
            min="1"
            max="6"
            value={formData.course}
            onChange={handleChange}
            aria-invalid={Boolean(errors.course)}
            aria-describedby={errors.course ? 'course-error' : undefined}
            required
          />
          <FieldError id="course-error" message={errors.course} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="name">
            Ваше ФИО{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иванов Иван Иванович"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="group">
            Группа{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="group"
            type="text"
            name="group"
            value={formData.group}
            maxLength={10}
            onChange={handleChange}
            placeholder="23201"
            aria-invalid={Boolean(errors.group)}
            aria-describedby={errors.group ? 'group-error' : undefined}
            required
          />
          <FieldError id="group-error" message={errors.group} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="dormitory">
            Общежитие{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <select
            id="dormitory"
            name="dormitory"
            value={formData.dormitory}
            onChange={handleChange}
            aria-invalid={Boolean(errors.dormitory)}
            aria-describedby={errors.dormitory ? 'dormitory-error' : undefined}
            required
          >
            <option value="" disabled>
              Выберите общежитие
            </option>
            {Object.keys(dormitoryAddress).map((dorm) => (
              <option key={dorm} value={dorm}>
                {dorm}
              </option>
            ))}
          </select>
          <FieldError id="dormitory-error" message={errors.dormitory} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="room">Комната</label>
          <input
            id="room"
            type="text"
            name="room"
            value={formData.room}
            maxLength={10}
            onChange={handleChange}
            placeholder="315"
            aria-invalid={Boolean(errors.room)}
            aria-describedby={errors.room ? 'room-error' : undefined}
          />
          <FieldError id="room-error" message={errors.room} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="tel">
            Ваш телефон{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="tel"
            type="tel"
            name="tel"
            value={formData.tel}
            maxLength={25}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="+7 999 123-45-67"
            aria-invalid={Boolean(errors.tel)}
            aria-describedby={errors.tel ? 'tel-error' : undefined}
            required
          />
          <FieldError id="tel-error" message={errors.tel} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Данные гостя</legend>
        <div className={styles.inputBlock}>
          <label htmlFor="guest">
            ФИО гостя{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="guest"
            type="text"
            name="guest"
            value={formData.guest}
            onChange={handleChange}
            placeholder="Петров Пётр Петрович"
            aria-invalid={Boolean(errors.guest)}
            aria-describedby={errors.guest ? 'guest-error' : undefined}
            required
          />
          <FieldError id="guest-error" message={errors.guest} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="relationship">Степень родства</label>
          <input
            id="relationship"
            type="text"
            name="relationship"
            value={formData.relationship}
            placeholder="Брат, мать, друг"
            maxLength={60}
            onChange={handleChange}
            aria-invalid={Boolean(errors.relationship)}
            aria-describedby={errors.relationship ? 'relationship-error' : undefined}
          />
          <FieldError id="relationship-error" message={errors.relationship} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="start">
            Дата начала приглашения{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="start"
            type="date"
            name="start"
            value={formData.start}
            onChange={handleChange}
            aria-invalid={Boolean(errors.start)}
            aria-describedby={errors.start ? 'start-error' : undefined}
            required
          />
          <FieldError id="start-error" message={errors.start} />
        </div>

        <div className={styles.inputBlock}>
          <label htmlFor="end">
            Дата конца приглашения{' '}
            <span className={styles.requiredMark} aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="end"
            type="date"
            name="end"
            value={formData.end}
            min={formData.start}
            onChange={handleChange}
            aria-invalid={Boolean(errors.end)}
            aria-describedby={errors.end ? 'end-error' : undefined}
            required
          />
          <FieldError id="end-error" message={errors.end} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Данные соседей</legend>
        {formData.roommates.map((roommate, index) => (
          <input
            key={index}
            id={`roommate-${index + 1}`}
            name={`roommate-${index + 1}`}
            type="text"
            value={roommate}
            onChange={(event) => handleRoommateChange(index, event.currentTarget.value)}
            aria-label={`ФИО соседа ${index + 1}`}
            aria-invalid={Boolean(errors.roommates)}
            aria-describedby={errors.roommates ? 'roommates-error' : undefined}
            placeholder={`ФИО соседа ${index + 1}`}
          />
        ))}
        <FieldError id="roommates-error" message={errors.roommates} />
      </fieldset>

      <label className={styles.bureaucracyBlock}>
        <input
          id="overbureaucracy"
          type="checkbox"
          name="overbureaucracy"
          checked={formData.overbureaucracy}
          onChange={handleChange}
          aria-describedby="bureaucracy-description"
        />
        <span>
          <strong>Режим максимальной бюрократии</strong>
          <span id="bureaucracy-description" className={styles.bureaucracyDescription}>
            Для увеличения макулатуры разделить период посещения на отдельные заявления — каждое не
            более чем на неделю.
          </span>
        </span>
      </label>

      <div className={styles.submitBlock}>
        <button type="submit" className={styles.buttonSubmit}>
          Получить заявление
        </button>

        {PDFData && (
          <PDFErrorBoundary
            fallback={
              <div className={styles.alert} role="alert">
                <p>Не удалось загрузить или открыть генератор PDF.</p>
              </div>
            }
          >
            <Suspense fallback={<span role="status">Загрузка генератора PDF...</span>}>
              <DownloadPdfButton data={PDFData} />
              <a
                className={styles.orderLink}
                href="https://t.me/sep_technologies?direct"
                target="_blank"
              >
                Заказать бесплатную печать
              </a>
            </Suspense>
          </PDFErrorBoundary>
        )}
      </div>
    </form>
  );
}
