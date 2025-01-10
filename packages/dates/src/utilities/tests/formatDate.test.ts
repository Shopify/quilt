import {formatDate} from '../formatDate';

jest.mock('../../map-deprecated-timezones', () => ({
  mapDeprecatedTimezones: jest.fn(),
}));

const mapDeprecatedTimezones: jest.Mock = jest.requireMock(
  '../../map-deprecated-timezones',
).mapDeprecatedTimezones;

describe('formatDate', () => {
  it('maps the deprecated timezone', () => {
    const date = new Date();
    const locale = 'en-UA';
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Kyiv',
    };

    formatDate(date, locale, options);
    expect(mapDeprecatedTimezones).toHaveBeenCalledWith('Europe/Kyiv');
  });
});
