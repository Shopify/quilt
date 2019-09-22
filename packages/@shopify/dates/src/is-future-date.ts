export function isFutureDate(date: Date, now = new Date()) {
  return now < date;
}
