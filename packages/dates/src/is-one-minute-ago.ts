import {isFutureDate} from './is-future-date';
import {TimeUnit} from './constants';

export function isOneMinuteAgo(date: Date, now = new Date()) {
  const dateDiff = now.getTime() - date.getTime();
  return (
    !isFutureDate(date, now) &&
    dateDiff > TimeUnit.Minute &&
    dateDiff < TimeUnit.Minute * 2
  );
}
