import type {ErrorHandler} from './performance-report';
import {usePerformanceReport} from './performance-report';

interface Props {
  url: string;
  onError?: ErrorHandler;
  locale?: string;
  finishedNavigationsOnly?: boolean;
}

export function PerformanceReport({
  url,
  onError,
  locale,
  finishedNavigationsOnly,
}: Props) {
  usePerformanceReport(url, {onError, locale, finishedNavigationsOnly});

  return null;
}
