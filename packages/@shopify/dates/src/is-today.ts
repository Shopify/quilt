import {isSameDay} from './is-same-day';

export function isToday(date: Date, timeZone?: string) {
  return isSameDay(date, new Date(), timeZone);
}
