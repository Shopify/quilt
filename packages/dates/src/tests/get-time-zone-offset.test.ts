import {getTimeZoneOffset} from '../get-time-zone-offset';

describe('getTimeZoneOffset()', () => {
  it('returns the correct time zone offset between Australia/Perth and UTC', () => {
    const date = new Date('2018-04-20T00:00:00+00:00');
    const timeZoneOffset = getTimeZoneOffset(date, 'Australia/Perth', 'UTC');

    expect(timeZoneOffset).toEqual(480);
  });

  it('returns the correct time zone offset between America/Toronto and UTC when DST is in effect', () => {
    const date = new Date('2018-04-20T00:00:00+00:00');
    const timeZoneOffset = getTimeZoneOffset(date, 'America/Toronto', 'UTC');

    expect(timeZoneOffset).toEqual(-240);
  });

  it('returns the correct time zone offset between America/Toronto and UTC when DST is not in effect', () => {
    const date = new Date('2018-01-20T00:00:00+00:00');
    const timeZoneOffset = getTimeZoneOffset(date, 'America/Toronto', 'UTC');

    expect(timeZoneOffset).toEqual(-300);
  });

  it('returns the correct time zone offset between America/Toronto and Australia/Perth', () => {
    const date = new Date('2018-04-20T00:00:00+00:00');
    const timeZoneOffset = getTimeZoneOffset(
      date,
      'America/Toronto',
      'Australia/Perth',
    );

    expect(timeZoneOffset).toEqual(-720);
  });

  it('returns 0 if no arguments passed', () => {
    const timeZoneOffset = getTimeZoneOffset();

    expect(timeZoneOffset).toEqual(0);
  });

  describe('DST boundaries', () => {
    it('returns regular offset at the start of spring forward DST boundary day', () => {
      const date = new Date('2018-10-07T00:00:00+10:00');
      const timeZoneOffset = getTimeZoneOffset(date, 'Australia/Sydney', 'UTC');

      expect(timeZoneOffset).toEqual(600);
    });

    it('returns DST offset at the end of spring forward DST boundary day', () => {
      const date = new Date('2018-10-07T23:59:59+11:00');
      const timeZoneOffset = getTimeZoneOffset(date, 'Australia/Sydney', 'UTC');

      expect(timeZoneOffset).toEqual(660);
    });

    it('returns DST offset at the start of fall backward DST boundary day', () => {
      const date = new Date('2019-04-07T00:00:00+11:00');
      const timeZoneOffset = getTimeZoneOffset(date, 'Australia/Sydney', 'UTC');

      expect(timeZoneOffset).toEqual(660);
    });

    it('returns regular offset at the end of fall backward DST boundary day', () => {
      const date = new Date('2019-04-07T23:59:59+10:00');
      const timeZoneOffset = getTimeZoneOffset(date, 'Australia/Sydney', 'UTC');

      expect(timeZoneOffset).toEqual(600);
    });
  });
});
