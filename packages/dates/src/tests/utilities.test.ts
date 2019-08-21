import {formatDate} from '../utilities/formatDate';

describe('formatDate()', () => {
  it('formats dates into YYYY-MM-DD', () => {
    const date = new Date(2018, 0, 0);
    expect(formatDate(date, 'es')).toBe('2017-12-31');
  });

  it('formats with the Etc/GMT+12 timezone', () => {
    const date = new Date('2018-01-01T12:34:56-12:00');
    const locale = 'en';
    const timeZone = 'Etc/GMT+12';
    const options = {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const expected = '1/1/2018, 12:34:56 PM';

    expect(formatDate(date, locale, options)).toBe(expected);
  });
});
