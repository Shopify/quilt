export function formatDate(
  date: Date,
  locales: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  // Etc/GMT+12 is not supported in most browsers and there is no equivalent fallback
  if (options.timeZone != null && options.timeZone === 'Etc/GMT+12') {
    const adjustedDate = new Date(date.valueOf() - 12 * 60 * 60 * 1000);

    return Intl.DateTimeFormat(locales, {...options, timeZone: 'UTC'}).format(
      adjustedDate,
    );
  }

  return Intl.DateTimeFormat(locales, options).format(date);
}
