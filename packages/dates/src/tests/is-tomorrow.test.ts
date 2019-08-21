import {clock} from '@shopify/jest-dom-mocks';
import {isTomorrow} from '../is-tomorrow';

describe('isTomorrow()', () => {
  describe('UTC timezone', () => {
    it('returns true if input is tomorrow', () => {
      clock.mock(new Date('2018-01-01T00:00:00.000+00:00'));
      const date = new Date('2018-01-02T23:59:59.999+00:00');

      expect(isTomorrow(date, 'UTC')).toBe(true);
      clock.restore();
    });

    it('returns false if input is not tomorrow', () => {
      clock.mock(new Date('2018-01-02T00:00:00.000+00:00'));
      const date = new Date('2018-01-02T23:59:59.999+00:00');

      expect(isTomorrow(date, 'UTC')).toBe(false);
      clock.restore();
    });
  });

  describe('not UTC timezone', () => {
    it('returns true if input is tomorrow', () => {
      clock.mock(new Date('2018-01-01T00:00:00.000+08:00'));
      const date = new Date('2018-01-02T23:59:59.999+08:00');

      expect(isTomorrow(date, 'Australia/Perth')).toBe(true);
      clock.restore();
    });

    it('returns false if input is not tomorrow', () => {
      clock.mock(new Date('2018-01-02T00:00:00.000+08:00'));
      const date = new Date('2018-01-02T23:59:59.999+08:00');

      expect(isTomorrow(date, 'Australia/Perth')).toBe(false);
      clock.restore();
    });
  });

  describe('Daylight Saving Time', () => {
    it('returns true when crossing spring forward DST boundary day', () => {
      clock.mock(new Date('2018-03-24T12:00:00.000+02:00'));
      const date = new Date('2018-03-25T12:00:00.000+01:00');

      expect(isTomorrow(date, 'Europe/Stockholm')).toBe(true);
      clock.restore();
    });

    it('returns true when crossing fall back DST boundary day', () => {
      clock.mock(new Date('2017-10-28T12:00:00.000+01:00'));
      const date = new Date('2017-10-29T12:00:00.000+02:00');

      expect(isTomorrow(date, 'Europe/Stockholm')).toBe(true);
      clock.restore();
    });
  });
});
