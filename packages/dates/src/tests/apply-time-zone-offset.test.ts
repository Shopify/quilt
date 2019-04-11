import {applyTimeZoneOffset} from '../apply-time-zone-offset';

describe('applyTimeZoneOffset()', () => {
  describe('UTC timezone', () => {
    it('applies the timezone offset', () => {
      const date = new Date('2018-05-28T11:22:33');
      const expected = new Date('2018-05-28T11:22:33+00:00');

      expect(applyTimeZoneOffset(date, 'UTC')).toStrictEqual(expected);
    });
  });

  describe('not UTC timezone', () => {
    it('applies the timezone offset', () => {
      const date = new Date('2018-05-28T11:22:33');
      const expected = new Date('2018-05-28T11:22:33+08:00');

      expect(applyTimeZoneOffset(date, 'Australia/Perth')).toStrictEqual(
        expected,
      );
    });
  });

  describe('Daylight Saving Time', () => {
    it('applies timezone offset when in DST', () => {
      const date = new Date('2018-12-01T00:00:00+00:00');
      const expected = new Date('2018-12-01T00:00:00+11:00');

      expect(
        applyTimeZoneOffset(date, 'Australia/Sydney', 'UTC'),
      ).toStrictEqual(expected);
    });

    it('applies timezone offset when not in DST', () => {
      const date = new Date('2018-06-01T14:00:00+00:00');
      const expected = new Date('2018-06-01T14:00:00+10:00');

      expect(
        applyTimeZoneOffset(date, 'Australia/Sydney', 'UTC'),
      ).toStrictEqual(expected);
    });

    it('applies timezone offset when applying the offset crosses the spring forward DST boundary', () => {
      const date = new Date('2018-10-07T00:00:00+00:00');
      const expected = new Date('2018-10-07T00:00:00+10:00');

      expect(
        applyTimeZoneOffset(date, 'Australia/Sydney', 'UTC'),
      ).toStrictEqual(expected);
    });

    it('applies timezone offset when applying the offset crosses the fall back DST boundary', () => {
      const date = new Date('2019-04-07T00:00:00+00:00');
      const expected = new Date('2019-04-07T00:00:00+11:00');

      expect(
        applyTimeZoneOffset(date, 'Australia/Sydney', 'UTC'),
      ).toStrictEqual(expected);
    });
  });
});
