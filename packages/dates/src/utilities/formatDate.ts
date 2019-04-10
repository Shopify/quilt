import memoize from 'lodash/memoize';

const memoizedGetDateTimeFormat = memoize(
  getDateTimeFormat,
  dateTimeFormatCacheKey,
);

export function formatDate(
  date: Date,
  locales: string | string[],
  options: Intl.DateTimeFormatOptions = {},
) {
  // Etc/GMT+12 is not supported in most browsers and there is no equivalent fallback
  if (options.timeZone != null && options.timeZone === 'Etc/GMT+12') {
    const adjustedDate = new Date(date.valueOf() - 12 * 60 * 60 * 1000);

    return memoizedGetDateTimeFormat(locales, {
      ...options,
      timeZone: 'UTC',
    }).format(adjustedDate);
  }

  return memoizedGetDateTimeFormat(locales, options).format(date);
}

function getDateTimeFormat(
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
) {
  return Intl.DateTimeFormat(locales, options);
}

function dateTimeFormatCacheKey(
  locales: string | string[],
  options?: Intl.DateTimeFormatOptions,
) {
  return `${locales}-${JSON.stringify(options)}`;
}
