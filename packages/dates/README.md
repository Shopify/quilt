# `@shopify/dates`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fdates.svg)](https://badge.fury.io/js/%40shopify%2Fdates.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/dates.svg)

Lightweight date operations.

## Installation

```bash
$ yarn add @shopify/dates
```

## Usage

This library exports helpers, that allow apps to easily work with dates and timezones.

### `applyTimeZoneOffset`

```ts
import {applyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone = 'Australia/Perth';

const newDate = applyTimeZoneOffset(date, timeZone);
```

### `getDateTimeParts`

```ts
import {getDateTimeParts} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone = 'Australia/Perth';

const dateTimeParts = getDateTimeParts(date, timeZone);
const month = dateTimeParts.month();
const year = dateTimeParts.year();
```

### `getTimeZoneOffset`

```ts
import {getTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone1 = 'America/Toronto';
const timeZone2 = 'Australia/Perth';

const timeZoneOffset = getTimeZoneOffset(date, timeZone1, timeZone2);
```

### `isSameDay`

```ts
import {isSameDay} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameDay = isSameDay(date1, date2, timeZone);
```

### `isSameMonth`

```ts
import {isSameMonth} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameMonth = isSameMonth(date1, date2, timeZone);
```

### `isSameYear`

```ts
import {isSameYear} from '@shopify/dates';

const date1 = '2018-01-01Z00:00';
const date2 = '2018-01-02Z23:59';
const timeZone = 'America/Toronto';

const sameYear = isSameYear(date1, date2, timeZone);
```

### `isToday`

```ts
import {isToday} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const today = isToday(date, timeZone);
```

### `isTomorrow`

```ts
import {isTomorrow} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const tomorrow = isTomorrow(date, timeZone);
```

### `isYesterday`

```ts
import {isYesterday} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'America/Toronto';

const yesterday = isYesterday(date, timeZone);
```

### `parseDateString`

```ts
import {parseDateString} from '@shopify/dates';

const date = '2018-01-01Z00:00';
const timeZone = 'UTC';

const parsed = parseDateString(date, timeZone);
```

### `unapplyTimeZoneOffset`

```ts
import {unapplyTimeZoneOffset} from '@shopify/dates';

const date = new Date('2018-06-01Z14:00');
const timeZone = 'Australia/Perth';

const newDate = unapplyTimeZoneOffset(date, offset);
```
