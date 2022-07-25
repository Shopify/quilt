/**
 * Allowed date string formats
 * yyyy-mm-dd
 * yyyy-mm-ddThh:mm:ss.fff
 * yyyy-mm-ddThh:mm:ss.fff+hh:mm
 * yyyy-mm-ddThh:mm:ss.fff-hh:mm
 * yyyy-mm-ddThh:mm:ss.fffZ
 */
const DATE_TIME_PARTS_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(?:(Z|(?:(\+|-)(\d{2}):(\d{2}))))?)?$/;

export function parseDateStringParts(dateString: string) {
  const dateTimeParts = new RegExp(DATE_TIME_PARTS_REGEX).exec(dateString);

  if (dateTimeParts == null) {
    return null;
  }

  // slice the first regex part (the full match) off
  const [
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    timeZoneOffset,
    sign,
    timeZoneHour,
    timeZoneMinute,
  ] = Array.from(dateTimeParts).slice(1);

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    timeZoneOffset,
    sign,
    timeZoneHour,
    timeZoneMinute,
  };
}
