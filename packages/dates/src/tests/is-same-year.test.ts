import {isSameYear} from '../is-same-year';

describe('isSameYear()', () => {
  describe('UTC timezone', () => {
    it('returns true if inputs are the same year', () => {
      const date1 = new Date('2018-01-01T00:00:00.000+00:00');
      const date2 = new Date('2018-12-31T23:59:59.999+00:00');

      expect(isSameYear(date1, date2, 'UTC')).toBe(true);
    });

    it('returns false if inputs are not the same year', () => {
      const date1 = new Date('2017-01-01T00:00:00.000+00:00');
      const date2 = new Date('2018-12-31T23:59:59.999+00:00');

      expect(isSameYear(date1, date2, 'UTC')).toBe(false);
    });

    it('returns true for start and end of a leap year', () => {
      const date1 = new Date('2016-01-01T00:00:00.000+00:00');
      const date2 = new Date('2016-12-31T23:59:59.999+00:00');

      expect(isSameYear(date1, date2, 'UTC')).toBe(true);
    });
  });

  describe('not UTC timezone', () => {
    it('returns true if inputs are the same year', () => {
      const date1 = new Date('2018-01-01T00:00:00.000+08:00');
      const date2 = new Date('2018-12-31T23:59:59.999+08:00');

      expect(isSameYear(date1, date2, 'Australia/Perth')).toBe(true);
    });

    it('returns false if inputs are not the same year', () => {
      const date1 = new Date('2017-01-01T00:00:00.000+08:00');
      const date2 = new Date('2018-12-31T23:59:59.999+08:00');

      expect(isSameYear(date1, date2, 'Australia/Perth')).toBe(false);
    });

    it('returns true for start and end of a leap year', () => {
      const date1 = new Date('2016-01-01T00:00:00.000+08:00');
      const date2 = new Date('2016-12-31T23:59:59.999+08:00');

      expect(isSameYear(date1, date2, 'Australia/Perth')).toBe(true);
    });
  });
});
