import { useFormContext } from 'react-hook-form';
import type {
  ApplicationFormInput,
  ApplicationFormData,
} from '@/features/application-form/types/ApplicationFormData';
import { FieldError } from '@/features/application-form/components/FieldError/FieldError.tsx';

export function RoommateFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormInput, unknown, ApplicationFormData>();

  const roommatesErrorMessage = [0, 1, 2]
    .map((index) => errors.roommates?.[index]?.message)
    .find((message) => message !== undefined);

  return (
    <fieldset>
      <legend>Данные соседей</legend>
      {[0, 1, 2].map((index) => (
        <input
          key={index}
          id={`roommate-${index + 1}`}
          type="text"
          {...register(`roommates.${index}` as const)}
          aria-label={`ФИО соседа ${index + 1}`}
          aria-invalid={Boolean(errors.roommates?.[index])}
          aria-describedby={errors.roommates?.[index] ? 'roommates-error' : undefined}
          placeholder={`ФИО соседа ${index + 1}`}
        />
      ))}
      <FieldError id="roommates-error" message={roommatesErrorMessage} />
    </fieldset>
  );
}
