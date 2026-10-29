import { useFormContext } from 'react-hook-form';
import type {
  ApplicationFormInput,
  ApplicationFormData,
} from '@/features/application-form/types/ApplicationFormData';
import { faculties } from '@/features/application-form/constants/applicationForm.constants.ts';
import { FieldError } from '@/features/application-form/components/FieldError/FieldError.tsx';
import { dormitoryAddress } from '@/features/application-form/constants/dormitoryAddress.constants.ts';
import styles from '@/features/application-form/components/FormFields.module.css';

export function StudentFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormInput, unknown, ApplicationFormData>();

  return (
    <fieldset>
      <legend>Данные студента</legend>
      <div className={styles.inputBlock}>
        <label htmlFor="faculty">
          Факультет
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <select
          id="faculty"
          {...register('faculty')}
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
        <FieldError id="faculty-error" message={errors.faculty?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="course">
          Курс обучения
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="course"
          type="number"
          {...register('course', {
            setValueAs: (value: string) => (value === '' ? '' : Number(value)),
          })}
          min={1}
          max={6}
          aria-invalid={Boolean(errors.course)}
          aria-describedby={errors.course ? 'course-error' : undefined}
          required
        />
        <FieldError id="course-error" message={errors.course?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="name">
          Ваше ФИО
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          placeholder="Иванов Иван Иванович"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          required
        />
        <FieldError id="name-error" message={errors.name?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="group">
          Группа
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="group"
          type="text"
          {...register('group')}
          placeholder="23201"
          maxLength={10}
          aria-invalid={Boolean(errors.group)}
          aria-describedby={errors.group ? 'group-error' : undefined}
          required
        />
        <FieldError id="group-error" message={errors.group?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="dormitory">
          Общежитие
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <select
          id="dormitory"
          {...register('dormitory')}
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
        <FieldError id="dormitory-error" message={errors.dormitory?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="room">Комната</label>
        <input
          id="room"
          type="text"
          {...register('room')}
          placeholder="315"
          maxLength={10}
          aria-invalid={Boolean(errors.room)}
          aria-describedby={errors.room ? 'room-error' : undefined}
        />
        <FieldError id="room-error" message={errors.room?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="tel">
          Ваш телефон
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="tel"
          type="tel"
          {...register('tel')}
          autoComplete="tel"
          placeholder="+7 999 123-45-67"
          maxLength={25}
          aria-invalid={Boolean(errors.tel)}
          aria-describedby={errors.tel ? 'tel-error' : undefined}
          required
        />
        <FieldError id="tel-error" message={errors.tel?.message} />
      </div>
    </fieldset>
  );
}
