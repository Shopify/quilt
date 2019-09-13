import {clock} from '@shopify/jest-dom-mocks';
import {isLessThanOneMinuteAgo} from '../is-less-than-one-minute-ago';

describe('isLessThanOneMinuteAgo()', () => {
  it('returns false for dates in the future', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setFullYear(now.getFullYear() + 1);
    expect(isLessThanOneMinuteAgo(other, now)).toBe(false);
  });

  it('returns false for dates more than one minute apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setSeconds(now.getSeconds() - 61);
    expect(isLessThanOneMinuteAgo(other, now)).toBe(false);
  });

  it('returns false for dates exactly one minute apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setSeconds(now.getSeconds() - 60);
    expect(isLessThanOneMinuteAgo(other, now)).toBe(false);
  });

  it('returns true for dates less than one minute apart', () => {
    const now = new Date();
    const other = new Date(now.getTime());
    other.setSeconds(now.getSeconds() - 59);
    expect(isLessThanOneMinuteAgo(other, now)).toBe(true);
  });

  describe('Daylight Saving Time', () => {
    afterEach(() => {
      clock.restore();
    });

    it('returns true when crossing spring forward DST boundary', () => {
      clock.mock(new Date('2018-03-25T02:00:00.000+01:00'));
      const date = new Date('2018-03-25T03:00:00.000+02:00');

      expect(isLessThanOneMinuteAgo(date)).toBe(true);
    });

    it('returns true when crossing fall back DST boundary', () => {
      clock.mock(new Date('2017-10-29T03:00:00.000+02:00'));
      const date = new Date('2017-10-29T02:00:00.000+01:00');

      expect(isLessThanOneMinuteAgo(date)).toBe(true);
    });
  });
});
