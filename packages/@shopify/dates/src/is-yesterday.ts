import {isSameDay} from './is-same-day';

export function isYesterday(date: Date, timeZone?: string) {
  const now = new Date();
  const yesterday = new Date(now.valueOf() - 24 * 60 * 60 * 1000);

  return isSameDay(date, yesterday, timeZone);
}
