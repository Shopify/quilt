import {usePerformanceReport, ErrorHandler} from './performance-report';

interface Props {
  url: string;
  onError?: ErrorHandler;
  locale?: string;
}

export function PerformanceReport({url, onError, locale}: Props) {
  usePerformanceReport(url, {onError, locale});

  return null;
}
