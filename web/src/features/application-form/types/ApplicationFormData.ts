import type { z } from 'zod';

import type { applicationFormSchema } from '@/features/application-form/lib/applicationForm.schema';

export type ApplicationFormInput = z.input<typeof applicationFormSchema>;

export type ApplicationFormData = z.output<typeof applicationFormSchema>;
