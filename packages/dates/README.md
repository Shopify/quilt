# `@shopify/dates`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fdates.svg)](https://badge.fury.io/js/%40shopify%2Fdates.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)

Lightweight date operations library.

## Installation

```bash
yarn add @shopify/dates
```

## Usage

This library exports helpers that allow apps to easily work with dates and timezones.
Optional time zone parameters that are omitted are inferred as local.

### `applyTimeZoneOffset`

Takes in a date object and two optional time zone string parameters. Returns a new date object with the offset between the time zones added to it. We can also assume the passed date is in the first time zone and we want to calculate it in the second time zone.

```ts
import {applyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone1 = 'Australia/Perth';
const timeZone2 = 'America/Toronto';

const newDate = applyTimeZoneOffset(date, timeZone1, timeZone2); //'2018-06-01T02:00:00.000Z'
```

### `format`

Lighter replacement for [`format()` from the `moment` library](https://momentjs.com/docs/#/displaying/format/).
Can output to any given locale / timezone (defaults to the system's locale & timezone).
Handles a subset of the tokens `moment().format()` handles, namely the following:

|              |      |                                        |
| -----------: | ---- | -------------------------------------- |
|        Month | M    | 1 2 ... 11 12                          |
|              | MM   | 01 02 ... 11 12                        |
|              | MMM  | Jan Feb ... Nov Dec                    |
|              | MMMM | January February ... November December |
| Day of Month | D    | 1 2 ... 30 31                          |
|              | DD   | 01 02 ... 30 31                        |
|  Day of Week | ddd  | Sun Mon ... Fri Sat                    |
|              | dddd | Sunday Monday ... Friday Saturday      |
|         Year | YY   | 70 71 ... 29 30                        |
|              | YYYY | 1970 1971 ... 2029 2030                |
|         Hour | H    | 0 1 ... 22 23                          |
|              | HH   | 00 01 ... 22 23                        |
|              | h    | 1 2 ... 11 12                          |
|              | hh   | 01 02 ... 11 12                        |
|       Minute | m    | 0 1 ... 58 59                          |
|              | mm   | 00 01 ... 58 59                        |
|       Second | s    | 0 1 ... 58 59                          |
|              | ss   | 00 01 ... 58 59                        |
|        AM/PM | A    | AM PM                                  |
|              | a    | am pm                                  |

```ts
import {format} from '@shopify/dates';

const date = new Date(2021, 0, 14, 13, 2, 3);
const dateStr = format(date, 'YYYY-MM-DD h:mm:ss A'); // 2021-01-14 1:02:03 PM

const date2 = new Date(Date.UTC(2021, 1, 1));
const dateStr2 = format(date, 'M/D/YY', 'UTC', 'en-US'); // 1/1/21
```

### `formatDate`

Takes in a date object and two additional parameters, the locale and an optional options object. Returns a new date string with the applied locale and options.

```ts
import {formatDate} from '@shopify/dates';

const date = new Date('2020-02-18Z14:00');
const locales = 'en';
const options = {
  timeZone: 'America/New_York',
  hour: 'numeric',
};

const newDate = formatDate(date, locales, options); // 9 AM
```

### `getDateTimeParts`

Takes in a date object and an optional time zone string parameter. Returns an object with functions to get the year, month, day, weekday, hour, minute and second of the provided date.

```ts
import {getDateTimeParts} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone = 'Australia/Perth';

const dateTimeParts = getDateTimeParts(date, timeZone);

const year = dateTimeParts.year();
const month = dateTimeParts.month();
const day = dateTimeParts.day();
const weekday = dateTimeParts.weekday();
const hour = dateTimeParts.hour();
const minute = dateTimeParts.minute();
const second = dateTimeParts.second();
```

### `getTimeZoneOffset`

Takes in a date object and two optional time zone string parameters. Returns a number representing the offset between the two provided time zones in minutes.

```ts
import {getTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone1 = 'America/Toronto';
const timeZone2 = 'Australia/Perth';

const timeZoneOffset = getTimeZoneOffset(date, timeZone1, timeZone2);
```

### `isFutureDate`

Takes in a date object and an optional now date object to compare against (defaulting to a new date object). Returns a boolean indicating whether or not the first date is in the future.

```ts
import {isFutureDate} from '@shopify/dates';

const now = new Date('2018-01-01Z00:00');
const date = new Date('2018-01-02Z23:59');

const futureDay = isFutureDate(date, now);
```

### `isLessThanOneDayAgo`

Takes in a date object and an optional "now" date object (that defaults to `new Date()`). Returns a boolean indicating whether or not the date is less than one day before the "now" date.

```ts
import {isLessThanOneDayAgo} from '@shopify/dates';

const moreThanOneDayAgo = new Date('2018-01-01Z00:00');
const lessThanOneDayAgo = new Date(Date.now() - 23 * TimeUnit.Hour);

isLessThanOneDayAgo(moreThanOneDayAgo); // false
isLessThanOneDayAgo(lessThanOneDayAgo); // true
```

### `isLessThanOneHourAgo`

Takes in a date object and an optional "now" date object (that defaults to `new Date()`). Returns a boolean indicating whether or not the date is less than one hour before the "now" date.

```ts
import {isLessThanOneHourAgo} from '@shopify/dates';

const moreThanOneHourAgo = new Date('2018-01-01Z00:00');
const lessThanOneHourAgo = new Date(Date.now() - 59 * TimeUnit.Minute);

isLessThanOneHourAgo(moreThanOneHourAgo); // false
isLessThanOneHourAgo(lessThanOneHourAgo); // true
```

### `isLessThanOneMinuteAgo`

Takes in a date object and an optional "now" date object (that defaults to `new Date()`). Returns a boolean indicating whether or not the date is less than one minute before the "now" date.

```ts
import {isLessThanOneMinuteAgo} from '@shopify/dates';

const moreThanOneMinuteAgo = new Date('2018-01-01Z00:00');
const lessThanOneMinuteAgo = new Date(Date.now() - 59 * TimeUnit.Second);

isLessThanOneMinuteAgo(moreThanOneMinuteAgo); // false
isLessThanOneMinuteAgo(lessThanOneMinuteAgo); // true
```

### `isLessThanOneWeekAgo`

Takes in a date object and an optional "now" date object (that defaults to `new Date()`). Returns a boolean indicating whether or not the date is less than one week before the "now" date.

```ts
import {isLessThanOneWeekAgo} from '@shopify/dates';

const moreThanOneWeekAgo = new Date('2018-01-01Z00:00');
const lessThanOneWeekAgo = new Date(Date.now() - 6 * TimeUnit.Day);

isLessThanOneWeekAgo(moreThanOneWeekAgo); // false
isLessThanOneWeekAgo(lessThanOneWeekAgo); // true
```

### `isLessThanOneWeekAway`

Takes in a date object and an optional "now" date object (that defaults to `new Date()`). Returns a boolean indicating whether or not the date is less than one week after the "now" date.

```ts
import {isLessThanOneWeekAway} from '@shopify/dates';

const moreThanOneWeekAway = new Date(Date.now() + 8 * TimeUnit.Day);
const lessThanOneWeekAway = new Date(Date.now() + 6 * TimeUnit.Day);

isLessThanOneWeekAway(moreThanOneWeekAway); // false
isLessThanOneWeekAway(lessThanOneWeekAway); // true
```

### `isLessThanOneYearAgo`

Takes in a date object and an optional "now" date object (that defaults to `new Date()`). Returns a boolean indicating whether or not the date is less than one year before the "now" date.

```ts
import {isLessThanOneYearAgo} from '@shopify/dates';

const moreThanOneYearAgo = new Date('2018-01-01Z00:00');
const lessThanOneYearAgo = new Date(Date.now() - 51 * TimeUnit.Week);

isLessThanOneYearAgo(moreThanOneYearAgo); // false
isLessThanOneYearAgo(lessThanOneYearAgo); // true
```

### `isLessThanOneYearAway`

Takes in a date object and an optional "now" date object (that defaults to `new Date()`). Returns a boolean indicating whether or not the date is less than one year after the "now" date.

```ts
import {isLessThanOneYearAway} from '@shopify/dates';

const moreThanOneYearAway = new Date(Date.now() + 53 * TimeUnit.Week);
const lessThanOneYearAway = new Date(Date.now() + 51 * TimeUnit.Week);

isLessThanOneYearAway(moreThanOneYearAway); // false
isLessThanOneYearAway(lessThanOneYearAway); // true
```

### `isSameDay`

Takes in two date objects and an optional time zone string parameter. Returns a boolean indicating whether or not these two dates are in the same day.

```ts
import {isSameDay} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameDay = isSameDay(date1, date2, timeZone);
```

### `isSameMonth`

Takes in two date objects and an optional time zone string parameter. Returns a boolean indicating whether or not these two dates are in the same month.

```ts
import {isSameMonth} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameMonth = isSameMonth(date1, date2, timeZone);
```

### `isSameYear`

Takes in two date objects and an optional time zone string parameter. Returns a boolean indicating whether or not these two dates are in the same year.

```ts
import {isSameYear} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameYear = isSameYear(date1, date2, timeZone);
```

### `isToday`

Takes in a date object and an optional time zone string parameter. Returns a boolean indicating whether or not this date is today.

```ts
import {isToday} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const today = isToday(date, timeZone);
```

### `isTomorrow`

Takes in a date object and an optional time zone string parameter. Returns a boolean indicating whether or not this date is tomorrow.

```ts
import {isTomorrow} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const tomorrow = isTomorrow(date, timeZone);
```

### `isYesterday`

Takes in a date object and an optional time zone string parameter. Returns a boolean indicating whether or not this date is yesterday.

```ts
import {isYesterday} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const yesterday = isYesterday(date, timeZone);
```

### `mapDeprecatedTimezones`

Takes in a time zone string parameter. Returns a time zone string corresponding to the equivalent, non-deprecated time zone string.

```ts
import {mapDeprecatedTimezones} from '@shopify/dates';

const deprecatedTimeZone = 'Cuba';
const correctTimeZone = mapDeprecatedTimezones(deprecatedTimeZone); // In this case, returns 'America/Havana'
```

### `parseDateString`

Takes in a date string and an optional time zone string parameter. Returns a date object with the format '2018-05-28T12:30:00+00:00' (yyyy-mm-ddThh:mm:ss+00:00, where '+00:00' represents the time zone offset)

```ts
import {parseDateString} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'UTC';

const parsed = parseDateString(date, timeZone);
```

### `parseDateStringParts`

Takes in a date string. Returns parsed parts from that date string.

```ts
import {parseDateStringParts} from '@shopify/dates';

const date = '2018-05-28T12:30:00.123+05:30';

const {
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
} = parseDateStringParts(date);
```

### `unapplyTimeZoneOffset`

Takes in a date object and two optional time zone string parameters. Returns a new date object with the offset between the time zones subtracted from it. We can also assume the passed date is in the second time zone and we want to calculate it back in the first time zone.

```ts
import {unapplyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone1 = 'Australia/Perth';
const timeZone2 = 'America/Toronto';

const newDate = unapplyTimeZoneOffset(date, timeZone1, timeZone2); //2018-06-02T02:00:00.000Z
```
