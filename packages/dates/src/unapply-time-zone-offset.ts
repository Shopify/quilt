import {getTimeZoneOffset} from './get-time-zone-offset';

export function unapplyTimeZoneOffset(
  date: Date,
  timeZone1?: string,
  timeZone2?: string,
) {
  const timeZoneOffset = getTimeZoneOffset(date, timeZone1, timeZone2);

  return new Date(date.valueOf() + timeZoneOffset * 60 * 1000);
}
