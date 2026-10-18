export { PDFErrorBoundary } from './components/PDFErrorBoundary/PDFErrorBoundary.tsx';

export function loadDownloadPdfButton() {
  return import('./components/DownloadPdfButton/DownloadPdfButton.tsx').then((module) => ({
    default: module.DownloadPdfButton,
  }));
}
