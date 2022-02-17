import {getDateTimeParts} from '../get-date-time-parts';

describe('getDateTimeParts()', () => {
  describe('UTC timezone', () => {
    it('returns the value of the hour', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {hour} = getDateTimeParts(date, 'UTC');

      expect(hour()).toBe(20);
    });

    it('returns the value of the minute', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {minute} = getDateTimeParts(date, 'UTC');

      expect(minute()).toBe(36);
    });

    it('returns the value of the second', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {second} = getDateTimeParts(date, 'UTC');

      expect(second()).toBe(17);
    });

    it('returns the value of the year', () => {
      const date = new Date('2017-12-31T20:00:00+00:00');
      const {year} = getDateTimeParts(date, 'UTC');

      expect(year()).toBe(2017);
    });

    it('returns the value of the month', () => {
      const date = new Date('2017-12-31T20:00:00+00:00');
      const {month} = getDateTimeParts(date, 'UTC');

      expect(month()).toBe(12);
    });

    it('returns the value of the day', () => {
      const date = new Date('2017-12-31T20:00:00+00:00');
      const {day} = getDateTimeParts(date, 'UTC');

      expect(day()).toBe(31);
    });
  });

  describe('not UTC timezone', () => {
    it('returns the value of the hour', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {hour} = getDateTimeParts(date, 'Australia/Perth');

      expect(hour()).toBe(4);
    });

    it('returns the value of the minute', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {minute} = getDateTimeParts(date, 'Australia/Perth');

      expect(minute()).toBe(36);
    });

    it('returns the value of the second', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {second} = getDateTimeParts(date, 'Australia/Perth');

      expect(second()).toBe(17);
    });

    it('returns the value of the year', () => {
      const date = new Date('2017-12-31T20:00:00+00:00');
      const {year} = getDateTimeParts(date, 'Australia/Perth');

      expect(year()).toBe(2018);
    });

    it('returns the value of the month', () => {
      const date = new Date('2017-12-31T20:00:00+00:00');
      const {month} = getDateTimeParts(date, 'Australia/Perth');

      expect(month()).toBe(1);
    });

    it('returns the value of the day', () => {
      const date = new Date('2017-12-31T20:00:00+00:00');
      const {day} = getDateTimeParts(date, 'Australia/Perth');

      expect(day()).toBe(1);
    });
  });

  describe('not UTC timezone 2', () => {
    it('returns the value of the hour', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {hour} = getDateTimeParts(date, 'America/Toronto');

      expect(hour()).toBe(16);
    });

    it('returns the value of the minute', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {minute} = getDateTimeParts(date, 'America/Toronto');

      expect(minute()).toBe(36);
    });

    it('returns the value of the second', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {second} = getDateTimeParts(date, 'America/Toronto');

      expect(second()).toBe(17);
    });

    it('returns the value of the day', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {day} = getDateTimeParts(date, 'America/Toronto');

      expect(day()).toBe(29);
    });

    it('returns the value of the month', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {month} = getDateTimeParts(date, 'America/Toronto');

      expect(month()).toBe(5);
    });

    it('returns the value of the year', () => {
      const date = new Date('2018-05-29T20:36:17+00:00');
      const {year} = getDateTimeParts(date, 'America/Toronto');

      expect(year()).toBe(2018);
    });
  });

  describe('weekdays', () => {
    it('returns the value of the weekday in GMT', () => {
      const date = new Date('2018-05-30T20:00:00+00:00');
      const weekday = getDateTimeParts(date, 'GMT').weekday();

      expect(weekday).toBe(2);
    });

    it('returns the value of the weekday in Australia/Perth timezone', () => {
      const date = new Date('2018-05-30T20:00:00+00:00');
      const weekday = getDateTimeParts(date, 'Australia/Perth').weekday();

      expect(weekday).toBe(3);
    });

    it('returns 0 for a Monday', () => {
      const date = new Date('2018-05-28T20:00:00+00:00');
      const weekday = getDateTimeParts(date, 'GMT').weekday();

      expect(weekday).toBe(0);
    });
  });
});
