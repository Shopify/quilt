import {memoizedGetDateTimeFormat} from './formatDate';

export function getIanaTimeZone(
  locale?: string | string[],
  options?: Intl.DateTimeFormatOptions,
) {
  return memoizedGetDateTimeFormat(locale, options).resolvedOptions().timeZone;
}
