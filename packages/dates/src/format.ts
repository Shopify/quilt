import {memoizedGetDateTimeFormat} from './utilities';

interface DateTimeFormatOptions {
  localeMatcher?: 'lookup' | 'best fit';
  weekday?: 'long' | 'short' | 'narrow';
  era?: 'long' | 'short' | 'narrow';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZoneName?: 'long' | 'short';
  formatMatcher?: 'basic' | 'best fit';
  hour12?: boolean;
  timeZone?: string;
}

type Token =
  | 'YYYY'
  | 'YY'
  | 'MMMM'
  | 'MMM'
  | 'MM'
  | 'M'
  | 'DD'
  | 'D'
  | 'HH'
  | 'H'
  | 'hh'
  | 'h'
  | 'mm'
  | 'm'
  | 'ss'
  | 's'
  | 'A'
  | 'a'
  | 'dddd'
  | 'ddd';

type TokenDateTimeFormatOptionsMap = {
  [key in Token]: {
    type: Intl.DateTimeFormatPartTypes;
    options: DateTimeFormatOptions;
    extraTransform?: (str: string) => string;
  };
};

const TRANSFORM_MAP = {
  numericFromTwoDigit: (time: string) =>
    time.startsWith('0') && time.length === 2 ? time.charAt(1) : time,
  twoDigitFromNumeric: (time: string) =>
    time.length === 1 ? `0${time}` : time,
  lowercase: (time: string) => time.toLowerCase(),
};

const TOKEN_MAP: TokenDateTimeFormatOptionsMap = {
  YYYY: {type: 'year', options: {year: 'numeric'}},
  YY: {type: 'year', options: {year: '2-digit'}},
  MMMM: {type: 'month', options: {month: 'long'}},
  MMM: {type: 'month', options: {month: 'short'}},
  MM: {type: 'month', options: {month: '2-digit'}},
  // eslint-disable-next-line id-length
  M: {type: 'month', options: {month: 'numeric'}},
  DD: {type: 'day', options: {day: '2-digit'}},
  // eslint-disable-next-line id-length
  D: {type: 'day', options: {day: 'numeric'}},
  HH: {type: 'hour', options: {hour: '2-digit', hour12: false}},
  // eslint-disable-next-line id-length
  H: {
    type: 'hour',
    options: {hour: 'numeric', hour12: false},
    // extraTransform is needed when Node and Browsers don't respect the 2-digit
    // and numeric options, which happens occasionally for time units
    extraTransform: TRANSFORM_MAP.numericFromTwoDigit,
  },
  hh: {type: 'hour', options: {hour: '2-digit', hour12: true}},
  // eslint-disable-next-line id-length
  h: {type: 'hour', options: {hour: 'numeric', hour12: true}},
  mm: {
    type: 'minute',
    options: {minute: '2-digit'},
    // see 'H' token parsing for more details about extraTransform
    extraTransform: TRANSFORM_MAP.twoDigitFromNumeric,
  },
  // eslint-disable-next-line id-length
  m: {type: 'minute', options: {minute: 'numeric'}},
  ss: {
    type: 'second',
    options: {second: '2-digit'},
    extraTransform: TRANSFORM_MAP.twoDigitFromNumeric,
  },
  // eslint-disable-next-line id-length
  s: {type: 'second', options: {second: 'numeric'}},
  // eslint-disable-next-line id-length
  A: {
    type: 'dayPeriod',
    options: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    },
  },
  // eslint-disable-next-line id-length
  a: {
    type: 'dayPeriod',
    options: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    },
    extraTransform: TRANSFORM_MAP.lowercase,
  },
  dddd: {type: 'weekday', options: {weekday: 'long'}},
  ddd: {type: 'weekday', options: {weekday: 'short'}},
};

const ALL_TOKENS_REGEX = new RegExp(
  `(${Object.keys(TOKEN_MAP).join('|')})`,
  'g',
);

export function format(
  date: Date,
  fmtStr: string,
  tz?: string,
  localeStr?: string,
): string {
  const {locale, timeZone} = memoizedGetDateTimeFormat(localeStr, {
    timeZone: tz,
  }).resolvedOptions();

  return fmtStr.replace(ALL_TOKENS_REGEX, (token: Token) => {
    const {type, options, extraTransform} = TOKEN_MAP[token];

    const timeUnit = Intl.DateTimeFormat(locale, {
      timeZone,
      ...options,
    })
      .formatToParts(date)
      .find((part) => part.type === type)?.value;

    if (timeUnit !== undefined && extraTransform) {
      return extraTransform(timeUnit);
    } else {
      return timeUnit ?? '';
    }
  });
}
