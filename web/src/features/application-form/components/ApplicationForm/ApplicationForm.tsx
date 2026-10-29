import { lazy, Suspense, useState } from 'react';
import type {
  ApplicationFormInput,
  ApplicationFormData,
} from '@/features/application-form/types/ApplicationFormData';
import { applicationFormSchema } from '@/features/application-form/lib/applicationForm.schema';
import { PDFErrorBoundary, loadDownloadPdfButton } from '@/features/pdf-generation';
import { splitDateRange } from '@/features/application-form/lib/applicationForm.dateRange.ts';
import styles from './ApplicationForm.module.css';
import { recordGeneratedDocuments } from '@/features/application-form/api/recordGeneratedDocuments.ts';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentFields } from '@/features/application-form/components/StudentFields/StudentFields.tsx';
import { RoommateFields } from '@/features/application-form/components/RoommateFields/RoommateFields.tsx';
import { GuestFields } from '@/features/application-form/components/GuestFields/GuestFields.tsx';

const initialFormData: ApplicationFormInput = {
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
  const methods = useForm<ApplicationFormInput, unknown, ApplicationFormData>({
    defaultValues: initialFormData,
    resolver: zodResolver(applicationFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { register, handleSubmit } = methods;
  const [PDFData, setPDFData] = useState<ApplicationFormData[] | null>(null);

  function onSubmit(data: ApplicationFormData): void {
    const normalizedData = {
      ...data,
      roommates: data.roommates.filter(Boolean),
    };

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
    <FormProvider {...methods}>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => setPDFData(null)}
        noValidate
      >
        <h1 className={styles.header}>Заполните заявление на приглашение в общежитие</h1>
        <p className={styles.requiredHint}>
          <span aria-hidden="true">*</span> — обязательные поля
        </p>

        <StudentFields />
        <RoommateFields />
        <GuestFields />

        <label className={styles.bureaucracyBlock}>
          <input
            id="overbureaucracy"
            type="checkbox"
            {...register('overbureaucracy')}
            aria-describedby="bureaucracy-description"
          />
          <span>
            <strong>Режим максимальной бюрократии</strong>
            <span id="bureaucracy-description" className={styles.bureaucracyDescription}>
              Для увеличения макулатуры разделить период посещения на отдельные заявления — каждое
              не более чем на неделю.
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
    </FormProvider>
  );
}
