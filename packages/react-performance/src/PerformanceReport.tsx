import {NavigationResult} from '@shopify/performance';
import type {ErrorHandler} from './performance-report';
import {usePerformanceReport} from './performance-report';

interface Props {
  url: string;
  onError?: ErrorHandler;
  locale?: string;
  resultsToReport?: NavigationResult[];
}

export function PerformanceReport({
  url,
  onError,
  locale,
  resultsToReport,
}: Props) {
  usePerformanceReport(url, {onError, locale, resultsToReport});

  return null;
}
