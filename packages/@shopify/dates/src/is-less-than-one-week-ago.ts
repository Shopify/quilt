import {isFutureDate} from './is-future-date';
import {TimeUnit} from './constants';

export function isLessThanOneWeekAgo(date: Date, now = new Date()) {
  return (
    !isFutureDate(date, now) && now.getTime() - date.getTime() < TimeUnit.Week
  );
}
