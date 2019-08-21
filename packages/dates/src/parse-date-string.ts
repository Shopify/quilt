import {applyTimeZoneOffset} from './apply-time-zone-offset';
import {parseDateStringParts} from './parse-date-string-parts';

export function parseDateString(dateString: string, timeZone?: string) {
  const dateTimeParts = parseDateStringParts(dateString);

  if (dateTimeParts == null) {
    return null;
  }

  const {
    year: rawYear,
    month: rawMonth,
    day: rawDay,
    hour: rawHour,
    minute: rawMinute,
    second: rawSecond,
    millisecond: rawMillisecond,
    timeZoneOffset,
    sign,
    timeZoneHour: rawTimeZoneHour,
    timeZoneMinute: rawTimeZoneMinute,
  } = dateTimeParts;

  const year = parseInt(rawYear, 10);
  const month = parseInt(rawMonth, 10);
  const day = parseInt(rawDay, 10);
  const hour = rawHour == null ? 0 : parseInt(rawHour, 10);
  const minute = rawMinute == null ? 0 : parseInt(rawMinute, 10);
  const second = rawSecond == null ? 0 : parseInt(rawSecond, 10);
  const millisecond = rawMillisecond == null ? 0 : parseInt(rawMillisecond, 10);

  const timeZoneHour =
    rawTimeZoneHour == null ? 0 : parseInt(rawTimeZoneHour, 10);
  const timeZoneMinute =
    rawTimeZoneMinute == null ? 0 : parseInt(rawTimeZoneMinute, 10);

  const utcDate = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond),
  );

  if (timeZoneOffset === 'Z') {
    return utcDate;
  }

  if (sign == null) {
    return applyTimeZoneOffset(utcDate, timeZone, 'UTC');
  }

  switch (sign) {
    case '+':
      utcDate.setHours(utcDate.getHours() - timeZoneHour);
      utcDate.setMinutes(utcDate.getMinutes() - timeZoneMinute);
      return utcDate;
    case '-':
      utcDate.setHours(utcDate.getHours() + timeZoneHour);
      utcDate.setMinutes(utcDate.getMinutes() + timeZoneMinute);
      return utcDate;
    default:
      return null;
  }
}
