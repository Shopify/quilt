import {deprecatedTimezones} from './deprecated-timezones';

export function mapDeprecatedTimezones(timezone: string) {
  if (Object.keys(deprecatedTimezones).some((key) => key === timezone)) {
    return deprecatedTimezones[timezone];
  } else {
    return timezone;
  }
}
