import {getDateTimeParts} from './get-date-time-parts';
import {isSameYear} from './is-same-year';

export function isSameMonth(date1: Date, date2: Date, timeZone?: string) {
  const {month: month1} = getDateTimeParts(date1, timeZone);
  const {month: month2} = getDateTimeParts(date2, timeZone);

  return isSameYear(date1, date2, timeZone) && month1() === month2();
}
