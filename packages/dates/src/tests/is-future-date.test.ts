import {clock} from '@shopify/jest-dom-mocks';

import {isFutureDate} from '../is-future-date';

describe('isFutureDate()', () => {
  it('returns false if input date is the same as present datetime', () => {
    clock.mock(new Date('2018-01-01T00:00:00.000+00:00'));
    const date = new Date('2018-01-01T00:00:00.000+00:00');

    expect(isFutureDate(date)).toBe(false);
    clock.restore();
  });

  it('returns true if input date is after present datetime', () => {
    clock.mock(new Date('2018-01-01T00:00:00.000+00:00'));
    const date = new Date('2018-01-02T00:00:00.000+00:00');

    expect(isFutureDate(date)).toBe(true);
    clock.restore();
  });

  it('returns false if input date is before present datetime', () => {
    clock.mock(new Date('2018-01-02T00:00:00.000+00:00'));
    const date = new Date('2018-01-01T00:00:00.000+00:00');

    expect(isFutureDate(date)).toBe(false);
    clock.restore();
  });
});
