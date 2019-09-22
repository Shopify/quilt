import {isSameDay} from './is-same-day';

export function isTomorrow(date: Date, timeZone?: string) {
  const now = new Date();
  const tomorrow = new Date(now.valueOf() + 24 * 60 * 60 * 1000);

  return isSameDay(date, tomorrow, timeZone);
}
