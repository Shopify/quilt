export function isPastDate(date: Date, now = new Date()) {
  return now > date;
}
