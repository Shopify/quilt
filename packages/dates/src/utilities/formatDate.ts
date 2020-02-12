const intl = new Map();
const memoizedGetDateTimeFormat = function(locale, options) {
  const key = dateTimeFormatCacheKey(locale, options);
  if (intl.has(key)) {
    return intl.get(key);
  }
  const i = new Intl.DateTimeFormat(locale, options);
  intl.set(key, i);
  return i;
};

interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  hourCycle?: string;
}

export function formatDate(
  date: Date,
  locales: string | string[],
  options: FormatDateOptions = {},
) {
  if (options.hour12 != null && options.hourCycle != null) {
    options.hour12 = undefined;
    options.hourCycle = 'h23';
  }

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

function dateTimeFormatCacheKey(
  locales: string | string[],
  options?: Intl.DateTimeFormatOptions,
) {
  return `${locales}-${JSON.stringify(options)}`;
}
