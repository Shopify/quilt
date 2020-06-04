import {clock} from '@shopify/jest-dom-mocks';

import {isLessThanOneYearAway} from '../is-less-than-one-year-away';

describe('isLessThanOneYearAway()', () => {
  it('returns false for dates in the past', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setFullYear(now.getFullYear() - 1);
    expect(isLessThanOneYearAway(other, now)).toBe(false);
  });

  it('returns false for dates more than one year apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setDate(now.getDate() + 366);
    expect(isLessThanOneYearAway(other, now)).toBe(false);
  });

  it('returns false for dates exactly one year apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setDate(now.getDate() + 365);
    expect(isLessThanOneYearAway(other, now)).toBe(false);
  });

  it('returns true for dates less than one year apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setDate(now.getDate() + 364);
    expect(isLessThanOneYearAway(other, now)).toBe(true);
  });

  describe('Daylight Saving Time', () => {
    afterEach(() => {
      clock.restore();
    });

    it('returns true when crossing spring forward DST boundary', () => {
      clock.mock(new Date('2018-03-25T02:00:00.000+01:00'));
      const date = new Date('2018-03-25T03:00:00.000+02:00');

      expect(isLessThanOneYearAway(date)).toBe(true);
    });

    it('returns true when crossing fall back DST boundary', () => {
      clock.mock(new Date('2017-10-29T03:00:00.000+02:00'));
      const date = new Date('2017-10-29T02:00:00.000+01:00');

      expect(isLessThanOneYearAway(date)).toBe(true);
    });
  });
});
