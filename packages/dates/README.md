# `@shopify/dates`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fdates.svg)](https://badge.fury.io/js/%40shopify%2Fdates.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)

Allows React apps to easily implement date checking

## Installation

```bash
$ yarn add @shopify/dates
```

## Usage

This library exports helpers, which allow React apps to easily work with dates and timezones.

### apply-time-zone-offset

```ts
import {applyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01T14:00:00+00:00');
const timezone = 'Australia/Perth';

const month = getDateTimeParts(date, timeZone).month();
const year = getDateTimeParts(date, timeZone).year();
```

### get-date-time-parts

```ts
import {getDateTimeParts} from '@shopify/dates';

const date = new Date('2018-06-01T14:00:00+00:00');
const timezone = 'Australia/Perth';

const newdate = applyTimeZoneOffset(date, offset);
```

### get-time-zone-offset

```ts
import {getTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01T14:00:00+00:00');
const timezone1 = 'America/Toronto';
const timezone2 = 'Australia/Perth';

const timeZoneOffset = getTimeZoneOffset(date, timezone1, timezone2);
```

### is-same-[day/month/year]

```ts
import {isSameDay, isSameMonth, isSameYear} from '@shopify/dates';

const date1 = '2018-01-01T00:00:00.000+08:00';
const date2 = '2018-01-02T23:59:59.999+08:00';
const timezone = 'America/Toronto';

const sameDay = isSameDay(date1, date2, timezone);
const sameMonth = isSameMonth(date1, date2, timezone);
const sameYear = isSameYear(date1, date2, timezone);
```

### is-[today/tomorrow/yesterday]

```ts
import {isToday, isTomorrow, isYesterday} from '@shopify/dates';

const date = '2018-01-01T00:00:00.000+08:00';
const timezone = 'America/Toronto';

const today = isToday(date, timezone);
const tomorrow = isTomorrow(date, timezone);
const yesterday = isYesterday(date, timezone);
```

### parse-date-string

```ts
import {parseDateString} from '@shopify/dates';

const date = '2018-01-01T00:00:00.000+08:00';
const timezone = 'UTC';

const parsed = parseDateString(date, timezone);
```

### unapply-time-zone-offset

```ts
import {unapplyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01T14:00:00+00:00');
const timezone = 'Australia/Perth';

const newdate = unapplyTimeZoneOffset(date, offset);
```
