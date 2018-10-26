import {applyTimeZoneOffset} from './apply-time-zone-offset';

/**
 * Allowed date string formats
 * yyyy-mm-dd
 * yyyy-mm-ddThh:mm:ss
 * yyyy-mm-ddThh:mm:ss+hh:mm
 * yyyy-mm-ddThh:mm:ss-hh:mm
 * yyyy-mm-ddThh:mm:ssZ
 */
const DATE_TIME_PARTS_REGEX = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:(Z|(?:(\+|-)(\d{2}):(\d{2}))))?)?$/;

export function parseDateString(dateString: string, timeZone?: string) {
  const dateTimeParts = new RegExp(DATE_TIME_PARTS_REGEX).exec(dateString);

  if (dateTimeParts == null) {
    return null;
  }

  const [
    // @ts-ignore
    _,
    rawYear,
    rawMonth,
    rawDay,
    rawHour,
    rawMinute,
    rawSecond,
    timeZoneOffset,
    sign,
    rawTimeZoneHour,
    rawTimeZoneMinute,
  ] = dateTimeParts;

  const year = parseInt(rawYear, 10);
  const month = parseInt(rawMonth, 10);
  const day = parseInt(rawDay, 10);
  const hour = rawHour == null ? 0 : parseInt(rawHour, 10);
  const minute = rawMinute == null ? 0 : parseInt(rawMinute, 10);
  const second = rawSecond == null ? 0 : parseInt(rawSecond, 10);

  const timeZoneHour =
    rawTimeZoneHour == null ? 0 : parseInt(rawTimeZoneHour, 10);
  const timeZoneMinute =
    rawTimeZoneMinute == null ? 0 : parseInt(rawTimeZoneMinute, 10);

  const utcDate = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second),
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
