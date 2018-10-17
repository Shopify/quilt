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
  ['AF', Weekdays.Saturday],
  ['DZ', Weekdays.Saturday],
  ['BH', Weekdays.Saturday],
  ['EG', Weekdays.Saturday],
  ['IR', Weekdays.Saturday],
  ['IQ', Weekdays.Saturday],
  ['JO', Weekdays.Saturday],
  ['KW', Weekdays.Saturday],
  ['LY', Weekdays.Saturday],
  ['OM', Weekdays.Saturday],
  ['QA', Weekdays.Saturday],
  ['SA', Weekdays.Saturday],
  ['SY', Weekdays.Saturday],
  ['AE', Weekdays.Saturday],
  ['YE', Weekdays.Saturday],
  // Sunday
  ['AR', Weekdays.Sunday],
  ['BZ', Weekdays.Sunday],
  ['BO', Weekdays.Sunday],
  ['BR', Weekdays.Sunday],
  ['CA', Weekdays.Sunday],
  ['CL', Weekdays.Sunday],
  ['CN', Weekdays.Sunday],
  ['CO', Weekdays.Sunday],
  ['CR', Weekdays.Sunday],
  ['DO', Weekdays.Sunday],
  ['EC', Weekdays.Sunday],
  ['SV', Weekdays.Sunday],
  ['GT', Weekdays.Sunday],
  ['HN', Weekdays.Sunday],
  ['HK', Weekdays.Sunday],
  ['IL', Weekdays.Sunday],
  ['JM', Weekdays.Sunday],
  ['JP', Weekdays.Sunday],
  ['KE', Weekdays.Sunday],
  ['MO', Weekdays.Sunday],
  ['MX', Weekdays.Sunday],
  ['NI', Weekdays.Sunday],
  ['PA', Weekdays.Sunday],
  ['PE', Weekdays.Sunday],
  ['PH', Weekdays.Sunday],
  ['SG', Weekdays.Sunday],
  ['ZA', Weekdays.Sunday],
  ['KR', Weekdays.Sunday],
  ['TW', Weekdays.Sunday],
  ['US', Weekdays.Sunday],
  ['VE', Weekdays.Sunday],
  ['ZW', Weekdays.Sunday],
  // Monday
  ['AL', Weekdays.Monday],
  ['AD', Weekdays.Monday],
  ['AM', Weekdays.Monday],
  ['AU', Weekdays.Monday],
  ['AZ', Weekdays.Monday],
  ['BY', Weekdays.Monday],
  ['BE', Weekdays.Monday],
  ['BN', Weekdays.Monday],
  ['BG', Weekdays.Monday],
  ['HR', Weekdays.Monday],
  ['CZ', Weekdays.Monday],
  ['DK', Weekdays.Monday],
  ['EE', Weekdays.Monday],
  ['FI', Weekdays.Monday],
  ['FR', Weekdays.Monday],
  ['GF', Weekdays.Monday],
  ['GE', Weekdays.Monday],
  ['DE', Weekdays.Monday],
  ['GR', Weekdays.Monday],
  ['HU', Weekdays.Monday],
  ['IS', Weekdays.Monday],
  ['IN', Weekdays.Monday],
  ['ID', Weekdays.Monday],
  ['IE', Weekdays.Monday],
  ['IT', Weekdays.Monday],
  ['KZ', Weekdays.Monday],
  ['XK', Weekdays.Monday],
  ['KG', Weekdays.Monday],
  ['LV', Weekdays.Monday],
  ['LB', Weekdays.Monday],
  ['LT', Weekdays.Monday],
  ['LU', Weekdays.Monday],
  ['MK', Weekdays.Monday],
  ['MY', Weekdays.Monday],
  ['MC', Weekdays.Monday],
  ['MN', Weekdays.Monday],
  ['MA', Weekdays.Monday],
  ['NL', Weekdays.Monday],
  ['NZ', Weekdays.Monday],
  ['NO', Weekdays.Monday],
  ['PK', Weekdays.Monday],
  ['PY', Weekdays.Monday],
  ['PL', Weekdays.Monday],
  ['PT', Weekdays.Monday],
  ['RO', Weekdays.Monday],
  ['RU', Weekdays.Monday],
  ['RS', Weekdays.Monday],
  ['SK', Weekdays.Monday],
  ['ES', Weekdays.Monday],
  ['SE', Weekdays.Monday],
  ['CH', Weekdays.Monday],
  ['TH', Weekdays.Monday],
  ['TN', Weekdays.Monday],
  ['TR', Weekdays.Monday],
  ['UA', Weekdays.Monday],
  ['GB', Weekdays.Monday],
  ['UY', Weekdays.Monday],
  ['UZ', Weekdays.Monday],
  ['VN', Weekdays.Monday],
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
