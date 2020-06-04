import {isFutureDate} from './is-future-date';
import {TimeUnit} from './constants';

export function isLessThanOneWeekAway(date: Date, now = new Date()) {
  return (
    isFutureDate(date, now) && date.getTime() - now.getTime() < TimeUnit.Week
  );
}
