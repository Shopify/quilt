import {unapplyTimeZoneOffset} from '../unapply-time-zone-offset';

describe('unapplyTimeZoneOffset()', () => {
  describe('UTC timezone', () => {
    it('unapplies the timezone offset', () => {
      const date = new Date('2018-05-28T11:22:33+00:00');
      const expected = new Date('2018-05-28T11:22:33');

      expect(unapplyTimeZoneOffset(date, 'UTC')).toEqual(expected);
    });
  });

  describe('not UTC timezone', () => {
    it('unapplies the timezone offset', () => {
      const date = new Date('2018-05-28T11:22:33+08:00');
      const expected = new Date('2018-05-28T11:22:33');

      expect(unapplyTimeZoneOffset(date, 'Australia/Perth')).toEqual(expected);
    });
  });

  describe('Daylight Saving Time', () => {
    it('unapplies timezone offset when in DST', () => {
      const date = new Date('2018-12-01T00:00:00+11:00');
      const expected = new Date('2018-12-01T00:00:00+00:00');

      expect(unapplyTimeZoneOffset(date, 'Australia/Sydney', 'UTC')).toEqual(
        expected,
      );
    });

    it('unapplies timezone offset when not in DST', () => {
      const date = new Date('2018-06-01T00:00:00+10:00');
      const expected = new Date('2018-06-01T00:00:00+00:00');

      expect(unapplyTimeZoneOffset(date, 'Australia/Sydney', 'UTC')).toEqual(
        expected,
      );
    });

    it('unapplies timezone offset when unapplying the offset crosses the spring forward DST boundary', () => {
      const date = new Date('2018-10-07T00:00:00+10:00');
      const expected = new Date('2018-10-07T00:00:00+00:00');

      expect(unapplyTimeZoneOffset(date, 'Australia/Sydney', 'UTC')).toEqual(
        expected,
      );
    });

    it('unapplies timezone offset when unapplying the offset crosses the fall back DST boundary', () => {
      const date = new Date('2019-04-07T00:00:00+11:00');
      const expected = new Date('2019-04-07T00:00:00+00:00');

      expect(unapplyTimeZoneOffset(date, 'Australia/Sydney', 'UTC')).toEqual(
        expected,
      );
    });
  });
});
