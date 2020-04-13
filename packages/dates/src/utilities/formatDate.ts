const intl = new Map<string, Intl.DateTimeFormat>();
export function memoizedGetDateTimeFormat(
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
) {
  const key = dateTimeFormatCacheKey(locales, options);
  if (intl.has(key)) {
    return intl.get(key)!;
  }
  const i = new Intl.DateTimeFormat(locales, options);
  intl.set(key, i);
  return i;
}

const browserFeatureDetectionDate = Intl.DateTimeFormat('en', {
  hour: 'numeric',
});

interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  hourCycle?: string;
}

const resolvedOptions: FormatDateOptions | undefined =
  typeof browserFeatureDetectionDate.resolvedOptions === 'undefined'
    ? undefined
    : browserFeatureDetectionDate.resolvedOptions();

export function formatDate(
  date: Date,
  locales: string | string[],
  options: FormatDateOptions = {},
) {
  const hourCycleRequired =
    resolvedOptions != null &&
    options.hour12 === false &&
    resolvedOptions.hourCycle != null;

  if (hourCycleRequired) {
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

export function dateTimeFormatCacheKey(
  locales?: string | string[],
  options: Intl.DateTimeFormatOptions = {},
) {
  const localeKey = Array.isArray(locales) ? locales.sort().join('-') : locales;

  return `${localeKey}-${JSON.stringify(options)}`;
}
