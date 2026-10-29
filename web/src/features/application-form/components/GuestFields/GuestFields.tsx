import { useFormContext } from 'react-hook-form';
import type {
  ApplicationFormInput,
  ApplicationFormData,
} from '@/features/application-form/types/ApplicationFormData';
import { FieldError } from '@/features/application-form/components/FieldError/FieldError.tsx';
import styles from '@/features/application-form/components/FormFields.module.css';

export function GuestFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ApplicationFormInput, unknown, ApplicationFormData>();

  return (
    <fieldset>
      <legend>Данные гостя</legend>
      <div className={styles.inputBlock}>
        <label htmlFor="guest">
          ФИО гостя
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="guest"
          type="text"
          {...register('guest')}
          placeholder="Петров Пётр Петрович"
          aria-invalid={Boolean(errors.guest)}
          aria-describedby={errors.guest ? 'guest-error' : undefined}
          required
        />
        <FieldError id="guest-error" message={errors.guest?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="relationship">Степень родства</label>
        <input
          id="relationship"
          type="text"
          {...register('relationship')}
          placeholder="Брат, мать, друг"
          maxLength={60}
          aria-invalid={Boolean(errors.relationship)}
          aria-describedby={errors.relationship ? 'relationship-error' : undefined}
        />
        <FieldError id="relationship-error" message={errors.relationship?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="start">
          Дата начала приглашения
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="start"
          type="date"
          {...register('start', { deps: 'end' })}
          aria-invalid={Boolean(errors.start)}
          aria-describedby={errors.start ? 'start-error' : undefined}
          required
        />
        <FieldError id="start-error" message={errors.start?.message} />
      </div>

      <div className={styles.inputBlock}>
        <label htmlFor="end">
          Дата конца приглашения
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="end"
          type="date"
          {...register('end')}
          min={watch('start')}
          aria-invalid={Boolean(errors.end)}
          aria-describedby={errors.end ? 'end-error' : undefined}
          required
        />
        <FieldError id="end-error" message={errors.end?.message} />
      </div>
    </fieldset>
  );
}
