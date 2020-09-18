import {clock} from '@shopify/jest-dom-mocks';

import {isLessThanOneWeekAgo} from '../is-less-than-one-week-ago';

describe('isLessThanOneWeekAgo()', () => {
  it('returns false for dates in the future', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setFullYear(now.getFullYear() + 1);
    expect(isLessThanOneWeekAgo(other, now)).toBe(false);
  });

  it('returns false for dates more than one week apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setDate(now.getDate() - 8);
    expect(isLessThanOneWeekAgo(other, now)).toBe(false);
  });

  it('returns false for dates exactly one week apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setDate(now.getDate() - 7);
    expect(isLessThanOneWeekAgo(other, now)).toBe(false);
  });

  it('returns true for dates less than one week apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setDate(now.getDate() - 6);
    expect(isLessThanOneWeekAgo(other, now)).toBe(true);
  });

  describe('Daylight Saving Time', () => {
    afterEach(() => {
      clock.restore();
    });

    it('returns true when crossing spring forward DST boundary', () => {
      clock.mock(new Date('2018-03-25T02:00:00.000+01:00'));
      const date = new Date('2018-03-25T03:00:00.000+02:00');

      expect(isLessThanOneWeekAgo(date)).toBe(true);
    });

    it('returns true when crossing fall back DST boundary', () => {
      clock.mock(new Date('2017-10-29T03:00:00.000+02:00'));
      const date = new Date('2017-10-29T02:00:00.000+01:00');

      expect(isLessThanOneWeekAgo(date)).toBe(true);
    });
  });
});
