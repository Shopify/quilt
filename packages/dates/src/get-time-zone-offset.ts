import {getDateTimeParts} from './get-date-time-parts';

export function getTimeZoneOffset(
  date = new Date(),
  timeZone1?: string,
  timeZone2?: string,
) {
  const date1 = constructZonedDateFromParts(date, timeZone1);
  const date2 = constructZonedDateFromParts(date, timeZone2);

  return (date1.valueOf() - date2.valueOf()) / (1000 * 60);
}

function constructZonedDateFromParts(date: Date, timeZone?: string) {
  const {year, month, day, hour, minute, second} = getDateTimeParts(
    date,
    timeZone,
  );

  return new Date(
    Date.UTC(year(), month() - 1, day(), hour(), minute(), second()),
  );
}
