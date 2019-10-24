import {memoize} from '@shopify/decorators';
import {formatDate} from './utilities/formatDate';
import {sanitiseDateString} from './sanitise-date-string';

const TWO_DIGIT_REGEX = /(\d{2})/;

export function getDateTimeParts(date: Date, timeZone?: string) {
  return {
    year: () => DateTimeParts.getYear(date, timeZone),
    month: () => DateTimeParts.getMonth(date, timeZone),
    day: () => DateTimeParts.getDay(date, timeZone),
    weekday: () => DateTimeParts.getWeekday(date, timeZone),
    hour: () => DateTimeParts.getHour(date, timeZone),
    minute: () => DateTimeParts.getMinute(date, timeZone),
    second: () => DateTimeParts.getSecond(date, timeZone),
  };
}

function dateTimeCacheKey(unit: string) {
  return (date: Date, timeZone?: string) =>
    `${unit}-${date.toString()}-${timeZone}`;
}

enum Weekday {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

const weekdays: {[key in Weekday]: number} = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

function isWeekday(weekday: string): weekday is Weekday {
  return Object.keys(weekdays).some(key => key === weekday);
}

function assertNever(message: string): never {
  throw new Error(message);
}

function getWeekdayValue(weekday: string) {
  if (!isWeekday(weekday)) {
    return assertNever(`Unexpected weekday: ${weekday}`);
  }

  return weekdays[weekday];
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class DateTimeParts {
  @memoize(dateTimeCacheKey('year'))
  static getYear(date: Date, timeZone?: string) {
    if (isNaN(date.valueOf())) {
      throw new Error(
        `Unable to parse date: ${date} for timezone: ${timeZone}`,
      );
    }

    const yearString = formatDate(date, 'en', {
      timeZone,
      year: 'numeric',
    });

    const sanitisedYearString = sanitiseDateString(yearString);

    const year = parseInt(sanitisedYearString, 10);

    if (isNaN(year)) {
      throw new Error(`Unable to parse year: '${yearString}'`);
    }

    return year;
  }

  @memoize(dateTimeCacheKey('month'))
  static getMonth(date: Date, timeZone?: string) {
    const monthString = formatDate(date, 'en', {
      timeZone,
      month: 'numeric',
    });

    const sanitisedMonthString = sanitiseDateString(monthString);

    const month = parseInt(sanitisedMonthString, 10);

    if (isNaN(month)) {
      throw new Error(`Unable to parse month: '${monthString}'`);
    }

    return month;
  }

  @memoize(dateTimeCacheKey('day'))
  static getDay(date: Date, timeZone?: string) {
    const dayString = formatDate(date, 'en', {
      timeZone,
      day: 'numeric',
    });

    const sanitisedDayString = sanitiseDateString(dayString);

    const day = parseInt(sanitisedDayString, 10);

    if (isNaN(day)) {
      throw new Error(`Unable to parse day: '${dayString}'`);
    }

    return day;
  }

  @memoize(dateTimeCacheKey('weekday'))
  static getWeekday(date: Date, timeZone?: string) {
    const weekdayString = formatDate(date, 'en', {
      timeZone,
      weekday: 'long',
    });

    const sanitisedWeekdayString = sanitiseDateString(weekdayString);

    return getWeekdayValue(sanitisedWeekdayString);
  }

  @memoize(dateTimeCacheKey('hour'))
  static getHour(date: Date, timeZone?: string) {
    const hourString = formatDate(date, 'en', {
      timeZone,
      hour12: false,
      hour: 'numeric',
    });

    let hour = parseInt(hourString, 10);

    if (isNaN(hour)) {
      hour = DateTimeParts.getTimePartsFallback(date, timeZone).hour;
    }

    return hour;
  }

  @memoize(dateTimeCacheKey('minute'))
  static getMinute(date: Date, timeZone?: string) {
    const minuteString = formatDate(date, 'en', {
      timeZone,
      minute: 'numeric',
    });

    let minute = parseInt(minuteString, 10);

    if (isNaN(minute)) {
      minute = DateTimeParts.getTimePartsFallback(date, timeZone).minute;
    }

    return minute;
  }

  @memoize(dateTimeCacheKey('second'))
  static getSecond(date: Date, timeZone?: string) {
    const secondString = formatDate(date, 'en', {
      timeZone,
      second: 'numeric',
    });

    let second = parseInt(secondString, 10);

    if (isNaN(second)) {
      second = DateTimeParts.getTimePartsFallback(date, timeZone).second;
    }

    return second;
  }

  @memoize(dateTimeCacheKey('timePartsFallback'))
  private static getTimePartsFallback(date: Date, timeZone?: string) {
    const timeString = formatDate(date, 'en', {
      timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // In Microsoft Edge, Intl.DateTimeFormat returns invisible characters around the individual numbers
    const [dirtyHour, dirtyMinute, dirtySecond] = timeString.split(':');

    const rawHour = new RegExp(TWO_DIGIT_REGEX).exec(dirtyHour);
    const rawMinute = new RegExp(TWO_DIGIT_REGEX).exec(dirtyMinute);
    const rawSecond = new RegExp(TWO_DIGIT_REGEX).exec(dirtySecond);

    if (rawHour != null && rawMinute != null && rawSecond != null) {
      const hour = parseInt(rawHour[1], 10);
      const minute = parseInt(rawMinute[1], 10);
      const second = parseInt(rawSecond[1], 10);

      return {
        hour,
        minute,
        second,
      };
    }

    throw new Error(`Unable to parse timeString: '${timeString}'`);
  }
}
