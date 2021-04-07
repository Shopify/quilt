import {getTimeZoneOffset} from './get-time-zone-offset';

export function applyTimeZoneOffset(
  date: Date,
  timeZone1?: string,
  timeZone2?: string,
) {
  const dateToCheckForDSTOffset = new Date(date);
  dateToCheckForDSTOffset.setHours(2);
  const needsDSTOffset = date.getTimezoneOffset() !== dateToCheckForDSTOffset.getTimezoneOffset();
  const dstOffset = needsDSTOffset ? 60 : 0;

  const initialOffset = getTimeZoneOffset(date, timeZone1, timeZone2);
  const adjustedDate = new Date(date.valueOf() - initialOffset * 60 * 1000);
  const targetOffset = getTimeZoneOffset(adjustedDate, timeZone1, timeZone2);
  const offsetDiff = targetOffset - initialOffset - dstOffset;

  return new Date(adjustedDate.valueOf() - offsetDiff * 60 * 1000);
}
