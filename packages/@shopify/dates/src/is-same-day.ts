import {getDateTimeParts} from './get-date-time-parts';
import {isSameMonth} from './is-same-month';

export function isSameDay(date1: Date, date2: Date, timeZone?: string) {
  const {day: day1} = getDateTimeParts(date1, timeZone);
  const {day: day2} = getDateTimeParts(date2, timeZone);

  return isSameMonth(date1, date2, timeZone) && day1() === day2();
}
