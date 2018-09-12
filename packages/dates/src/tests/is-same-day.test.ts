import {isSameDay} from '../is-same-day';

describe('isSameDay()', () => {
  describe('UTC timezone', () => {
    it('returns true if inputs are the same day', () => {
      const date1 = new Date('2018-01-01T00:00:00.000+00:00');
      const date2 = new Date('2018-01-01T23:59:59.999+00:00');

      expect(isSameDay(date1, date2, 'UTC')).toBe(true);
    });

    it('returns false if inputs are not the same day', () => {
      const date1 = new Date('2018-01-01T00:00:00.000+00:00');
      const date2 = new Date('2018-01-02T23:59:59.999+00:00');

      expect(isSameDay(date1, date2, 'UTC')).toBe(false);
    });
  });

  describe('not UTC timezone', () => {
    it('returns true if inputs are the same day', () => {
      const date1 = new Date('2018-01-01T00:00:00.000+08:00');
      const date2 = new Date('2018-01-01T23:59:59.999+08:00');

      expect(isSameDay(date1, date2, 'Australia/Perth')).toBe(true);
    });

    it('returns false if inputs are not the same day', () => {
      const date1 = new Date('2018-01-01T00:00:00.000+08:00');
      const date2 = new Date('2018-01-02T23:59:59.999+08:00');

      expect(isSameDay(date1, date2, 'Australia/Perth')).toBe(false);
    });
  });

  describe('Daylight Saving Time', () => {
    it('returns true for start and end of spring forward DST boundary day', () => {
      const date1 = new Date('2018-03-25T00:00:00.000+01:00');
      const date2 = new Date('2018-03-25T23:59:59.999+02:00');

      expect(isSameDay(date1, date2, 'Europe/Stockholm')).toBe(true);
    });

    it('returns true for start and end of fallback DST boundary day', () => {
      const date1 = new Date('2017-10-29T00:00:00.000+02:00');
      const date2 = new Date('2017-10-29T23:59:59.999+01:00');

      expect(isSameDay(date1, date2, 'Europe/Stockholm')).toBe(true);
    });
  });
});
