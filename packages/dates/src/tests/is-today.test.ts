import {clock} from '@shopify/jest-dom-mocks';

import {isToday} from '../is-today';

describe('isToday()', () => {
  describe('UTC timezone', () => {
    it('returns true if input is today', () => {
      clock.mock(new Date('2018-01-01T00:00:00.000+00:00'));
      const date = new Date('2018-01-01T23:59:59.999+00:00');

      expect(isToday(date, 'UTC')).toBe(true);
      clock.restore();
    });

    it('returns false if input is not today', () => {
      clock.mock(new Date('2018-01-01T00:00:00.000+00:00'));
      const date = new Date('2018-01-02T23:59:59.999+00:00');

      expect(isToday(date, 'UTC')).toBe(false);
      clock.restore();
    });
  });

  describe('not UTC timezone', () => {
    it('returns true if input is today', () => {
      clock.mock(new Date('2018-01-01T00:00:00.000+08:00'));
      const date = new Date('2018-01-01T23:59:59.999+08:00');

      expect(isToday(date, 'Australia/Perth')).toBe(true);
      clock.restore();
    });

    it('returns false if input is not today', () => {
      clock.mock(new Date('2018-01-01T00:00:00.000+08:00'));
      const date = new Date('2018-01-02T23:59:59.999+08:00');

      expect(isToday(date, 'Australia/Perth')).toBe(false);
      clock.restore();
    });
  });

  describe('Daylight Saving Time', () => {
    it('returns true for start and end of spring forward DST boundary day', () => {
      clock.mock(new Date('2018-03-25T00:00:00.000+01:00'));
      const date = new Date('2018-03-25T23:59:59.999+02:00');

      expect(isToday(date, 'Europe/Stockholm')).toBe(true);
      clock.restore();
    });

    it('returns true for start and end of fallback DST boundary day', () => {
      clock.mock(new Date('2017-10-29T00:00:00.000+02:00'));
      const date = new Date('2017-10-29T23:59:59.999+01:00');

      expect(isToday(date, 'Europe/Stockholm')).toBe(true);
      clock.restore();
    });
  });
});
