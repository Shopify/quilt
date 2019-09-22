import {getDateTimeParts} from './get-date-time-parts';

export function isSameYear(date1: Date, date2: Date, timeZone?: string) {
  const {year: year1} = getDateTimeParts(date1, timeZone);
  const {year: year2} = getDateTimeParts(date2, timeZone);

  return year1() === year2();
}
