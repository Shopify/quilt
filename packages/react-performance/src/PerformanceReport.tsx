import {usePerformanceReport, ErrorHandler} from './performance-report';

interface Props {
  url: string;
  onError?: ErrorHandler;
}

export function PerformanceReport({url, onError}: Props) {
  usePerformanceReport(url, {onError});

  return null;
}
