export enum DateStyle {
  Long = 'Long',
  Short = 'Short',
  Humanize = 'Humanize',
  HumanizeWithTime = 'HumanizeWithTime',
  Time = 'Time',
}

export const dateStyle = {
  [DateStyle.Long]: {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  },
  [DateStyle.Short]: {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  },
  [DateStyle.Humanize]: {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
  [DateStyle.Time]: {
    hour: '2-digit',
    minute: '2-digit',
  },
};

export enum Weekdays {
  Sunday = 'sunday',
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
}

export const DEFAULT_WEEK_START_DAY = Weekdays.Sunday;
export const WEEK_START_DAYS = new Map([
  // Saturday
  ['AE', Weekdays.Saturday],
  ['AF', Weekdays.Saturday],
  ['BH', Weekdays.Saturday],
  ['DZ', Weekdays.Saturday],
  ['EG', Weekdays.Saturday],
  ['IQ', Weekdays.Saturday],
  ['IR', Weekdays.Saturday],
  ['JO', Weekdays.Saturday],
  ['KW', Weekdays.Saturday],
  ['LY', Weekdays.Saturday],
  ['OM', Weekdays.Saturday],
  ['QA', Weekdays.Saturday],
  ['SA', Weekdays.Saturday],
  ['SY', Weekdays.Saturday],
  ['YE', Weekdays.Saturday],
  // Sunday
  ['AR', Weekdays.Sunday],
  ['BO', Weekdays.Sunday],
  ['BR', Weekdays.Sunday],
  ['BZ', Weekdays.Sunday],
  ['CA', Weekdays.Sunday],
  ['CL', Weekdays.Sunday],
  ['CO', Weekdays.Sunday],
  ['CR', Weekdays.Sunday],
  ['DO', Weekdays.Sunday],
  ['EC', Weekdays.Sunday],
  ['GT', Weekdays.Sunday],
  ['HK', Weekdays.Sunday],
  ['HN', Weekdays.Sunday],
  ['IL', Weekdays.Sunday],
  ['JM', Weekdays.Sunday],
  ['JP', Weekdays.Sunday],
  ['KE', Weekdays.Sunday],
  ['KR', Weekdays.Sunday],
  ['MO', Weekdays.Sunday],
  ['MX', Weekdays.Sunday],
  ['NI', Weekdays.Sunday],
  ['PA', Weekdays.Sunday],
  ['PE', Weekdays.Sunday],
  ['PH', Weekdays.Sunday],
  ['SG', Weekdays.Sunday],
  ['SV', Weekdays.Sunday],
  ['TW', Weekdays.Sunday],
  ['US', Weekdays.Sunday],
  ['VE', Weekdays.Sunday],
  ['ZA', Weekdays.Sunday],
  ['ZW', Weekdays.Sunday],
  // Monday
  ['AD', Weekdays.Monday],
  ['AL', Weekdays.Monday],
  ['AM', Weekdays.Monday],
  ['AU', Weekdays.Monday],
  ['AZ', Weekdays.Monday],
  ['BE', Weekdays.Monday],
  ['BG', Weekdays.Monday],
  ['BN', Weekdays.Monday],
  ['BY', Weekdays.Monday],
  ['CH', Weekdays.Monday],
  ['CN', Weekdays.Monday],
  ['CZ', Weekdays.Monday],
  ['DE', Weekdays.Monday],
  ['DK', Weekdays.Monday],
  ['EE', Weekdays.Monday],
  ['ES', Weekdays.Monday],
  ['FI', Weekdays.Monday],
  ['FR', Weekdays.Monday],
  ['GB', Weekdays.Monday],
  ['GE', Weekdays.Monday],
  ['GF', Weekdays.Monday],
  ['GR', Weekdays.Monday],
  ['HR', Weekdays.Monday],
  ['HU', Weekdays.Monday],
  ['ID', Weekdays.Monday],
  ['IE', Weekdays.Monday],
  ['IN', Weekdays.Monday],
  ['IS', Weekdays.Monday],
  ['IT', Weekdays.Monday],
  ['KG', Weekdays.Monday],
  ['KZ', Weekdays.Monday],
  ['LB', Weekdays.Monday],
  ['LT', Weekdays.Monday],
  ['LU', Weekdays.Monday],
  ['LV', Weekdays.Monday],
  ['MA', Weekdays.Monday],
  ['MC', Weekdays.Monday],
  ['MK', Weekdays.Monday],
  ['MN', Weekdays.Monday],
  ['MY', Weekdays.Monday],
  ['NL', Weekdays.Monday],
  ['NO', Weekdays.Monday],
  ['NZ', Weekdays.Monday],
  ['PK', Weekdays.Monday],
  ['PL', Weekdays.Monday],
  ['PT', Weekdays.Monday],
  ['PY', Weekdays.Monday],
  ['RO', Weekdays.Monday],
  ['RS', Weekdays.Monday],
  ['RU', Weekdays.Monday],
  ['SE', Weekdays.Monday],
  ['SK', Weekdays.Monday],
  ['TH', Weekdays.Monday],
  ['TN', Weekdays.Monday],
  ['TR', Weekdays.Monday],
  ['UA', Weekdays.Monday],
  ['UY', Weekdays.Monday],
  ['UZ', Weekdays.Monday],
  ['VN', Weekdays.Monday],
  ['XK', Weekdays.Monday],
]);

/* eslint-disable line-comment-position */
// See https://en.wikipedia.org/wiki/Right-to-left
export const RTL_LANGUAGES = [
  'ae', // Avestan
  'ar', // 'العربية', Arabic
  'arc', // Aramaic
  'bcc', // 'بلوچی مکرانی', Southern Balochi
  'bqi', // 'بختياري', Bakthiari
  'ckb', // 'Soranî / کوردی', Sorani
  'dv', // Dhivehi
  'fa', // 'فارسی', Persian
  'glk', // 'گیلکی', Gilaki
  'he', // 'עברית', Hebrew
  'ku', // 'Kurdî / كوردی', Kurdish
  'mzn', // 'مازِرونی', Mazanderani
  'nqo', // N'Ko
  'pnb', // 'پنجابی', Western Punjabi
  'ps', // 'پښتو', Pashto,
  'sd', // 'سنڌي', Sindhi
  'ug', // 'Uyghurche / ئۇيغۇرچە', Uyghur
  'ur', // 'اردو', Urdu
  'yi', // 'ייִדיש', Yiddish
];
/* eslint-enable */
