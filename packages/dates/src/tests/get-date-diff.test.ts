import {TimeUnit} from '../constants';
import {getDateDiff} from '../get-date-diff';

describe('getDateDiff()', () => {
  const now = new Date(2019, 1, 1);
  const testDate = new Date(now.getTime());
  testDate.setFullYear(now.getFullYear() - 1);

  it('returns expected diff in seconds', () => {
    const diff = getDateDiff(TimeUnit.Second, testDate, now);
    expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Second);
  });

  it('returns expected diff in minutes', () => {
    const diff = getDateDiff(TimeUnit.Minute, testDate, now);
    expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Minute);
  });

  it('returns expected diff in hours', () => {
    const diff = getDateDiff(TimeUnit.Hour, testDate, now);
    expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Hour);
  });

  it('returns expected diff in days', () => {
    const diff = getDateDiff(TimeUnit.Day, testDate, now);
    expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Day);
  });

  it('returns expected diff in weeks', () => {
    const diff = getDateDiff(TimeUnit.Week, testDate, now);
    expect(diff).toStrictEqual(Math.floor(TimeUnit.Year / TimeUnit.Week));
  });

  it('returns expected diff in years', () => {
    const diff = getDateDiff(TimeUnit.Year, testDate, now);
    expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Year);
  });

  describe('second date defaults to today', () => {
    beforeEach(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns expected diff in seconds', () => {
      const diff = getDateDiff(TimeUnit.Second, testDate);
      expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Second);
    });

    it('returns expected diff in minutes', () => {
      const diff = getDateDiff(TimeUnit.Minute, testDate);
      expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Minute);
    });

    it('returns expected diff in hours', () => {
      const diff = getDateDiff(TimeUnit.Hour, testDate);
      expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Hour);
    });

    it('returns expected diff in days', () => {
      const diff = getDateDiff(TimeUnit.Day, testDate);
      expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Day);
    });

    it('returns expected diff in weeks', () => {
      const diff = getDateDiff(TimeUnit.Week, testDate);
      expect(diff).toStrictEqual(Math.floor(TimeUnit.Year / TimeUnit.Week));
    });

    it('returns expected diff in years', () => {
      const diff = getDateDiff(TimeUnit.Year, testDate);
      expect(diff).toStrictEqual(TimeUnit.Year / TimeUnit.Year);
    });
  });
});
