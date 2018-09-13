# `@shopify/dates`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fdates.svg)](https://badge.fury.io/js/%40shopify%2Fdates.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)

Lightweight date operations library.

## Installation

```bash
$ yarn add @shopify/dates
```

## Usage

This library exports helpers that allow apps to easily work with dates and timezones.

### `applyTimeZoneOffset`

Takes in a date string and two optional time zone strings parameters. Returns a new date string with the offset between the time zones added to it.

```ts
import {applyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone1 = 'Australia/Perth';
const timeZone2 = 'America/Toronto';

const newDate = applyTimeZoneOffset(date, timeZone1, timeZone2);
```

### `getDateTimeParts`

Takes in a date string and an optional time zone parameter. Returns an object with functions to get the year, month, day, weekday, hour, minute and second of the provided date string.

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

Takes in a date string and two optional time zone parameters. Returns a number representing the offset between the two provided time zones.

```ts
import {getTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone1 = 'America/Toronto';
const timeZone2 = 'Australia/Perth';

const timeZoneOffset = getTimeZoneOffset(date, timeZone1, timeZone2);
```

### `isSameDay`

Takes in two date strings and an optional time zone parameter. Returns a boolean indicating whether or not these two dates are in the same day.

```ts
import {isSameDay} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameDay = isSameDay(date1, date2, timeZone);
```

### `isSameMonth`

Takes in two date strings and an optional time zone parameter. Returns a boolean indicating whether or not these two dates are in the same month.

```ts
import {isSameMonth} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameMonth = isSameMonth(date1, date2, timeZone);
```

### `isSameYear`

Takes in two date strings and an optional time zone parameter. Returns a boolean indicating whether or not these two dates are in the same year.

```ts
import {isSameYear} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameYear = isSameYear(date1, date2, timeZone);
```

### `isToday`

Takes in a date string and an optional time zone parameter. Returns a boolean indicating whether or not this date is today.

```ts
import {isToday} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const today = isToday(date, timeZone);
```

### `isTomorrow`

Takes in a date string and an optional time zone parameter. Returns a boolean indicating whether or not this date is tomorrow.

```ts
import {isTomorrow} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const tomorrow = isTomorrow(date, timeZone);
```

### `isYesterday`

Takes in a date string and an optional time zone parameter. Returns a boolean indicating whether or not this date is yesterday.

```ts
import {isYesterday} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const yesterday = isYesterday(date, timeZone);
```

### `parseDateString`

Takes in a date string and an optional time zone parameter. Returns a date string with the format '2018-05-28T12:30:00+00:00' (yyyy-mm-ddThh:mm:ss+00:00, where '+00:00' represents the time zone offset)

```ts
import {parseDateString} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'UTC';

const parsed = parseDateString(date, timeZone);
```

### `unapplyTimeZoneOffset`

Takes in a date string and two optional time zone strings parameters. Returns a new date string with the offset between the time zones subtracted from it.

```ts
import {unapplyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone = 'Australia/Perth';

const newDate = unapplyTimeZoneOffset(date, offset);
```
