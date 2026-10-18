import { PDFDownloadLink } from '@react-pdf/renderer';
import './DownloadPdfButton.module.css';

import type { ApplicationFormData } from '@/features/application-form/types/ApplicationFormData.ts';
import { PDFGenerator } from '@/features/pdf-generation/components/PDFGenerator/PDFGenerator.tsx';
import styles from './DownloadPdfButton.module.css';

type DownloadPdfButtonProps = {
  data: ApplicationFormData[];
};

export function DownloadPdfButton({ data }: DownloadPdfButtonProps) {
  return (
    <PDFDownloadLink
      document={<PDFGenerator data={data} />}
      fileName="dorm-guest-applications.pdf"
      className={styles.downloadButton}
    >
      {({ loading, error }) => {
        if (error) {
          return <span role="alert">Не удалось подготовить PDF</span>;
        }
        return loading ? 'Подготовка PDF...' : 'Скачать PDF';
      }}
    </PDFDownloadLink>
  );
}
