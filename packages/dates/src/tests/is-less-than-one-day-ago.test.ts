import {clock} from '@shopify/jest-dom-mocks';

import {isLessThanOneDayAgo} from '../is-less-than-one-day-ago';

describe('isLessThanOneDayAgo()', () => {
  it('returns false for dates in the future', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setFullYear(now.getFullYear() + 1);
    expect(isLessThanOneDayAgo(other, now)).toBe(false);
  });

  it('returns false for dates more than one day apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setHours(now.getHours() - 25);
    expect(isLessThanOneDayAgo(other, now)).toBe(false);
  });

  it('returns false for dates exactly one day apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setHours(now.getHours() - 24);
    expect(isLessThanOneDayAgo(other, now)).toBe(false);
  });

  it('returns true for dates less than one day apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setHours(now.getHours() - 23);
    expect(isLessThanOneDayAgo(other, now)).toBe(true);
  });

  describe('Daylight Saving Time', () => {
    afterEach(() => {
      clock.restore();
    });

    it('returns true when crossing spring forward DST boundary', () => {
      clock.mock(new Date('2018-03-25T02:00:00.000+01:00'));
      const date = new Date('2018-03-25T03:00:00.000+02:00');

      expect(isLessThanOneDayAgo(date)).toBe(true);
    });

    it('returns true when crossing fall back DST boundary', () => {
      clock.mock(new Date('2017-10-29T03:00:00.000+02:00'));
      const date = new Date('2017-10-29T02:00:00.000+01:00');

      expect(isLessThanOneDayAgo(date)).toBe(true);
    });
  });
});
