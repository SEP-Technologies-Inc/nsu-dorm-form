import type { ApplicationFormData } from './ApplicationFormData.ts';

export type ApplicationFormErrors = Partial<
  Record<Exclude<keyof ApplicationFormData, 'overbureaucracy'>, string>
>;
