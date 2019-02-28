import {parseDateStringParts} from '../parse-date-string-parts';

describe('parseDateStringParts()', () => {
  it('parses yyyy-mm-dd date strings', () => {
    expect(parseDateStringParts('2018-05-28')).toMatchObject({
      year: '2018',
      month: '05',
      day: '28',
    });
  });

  it('parses yyyy-mm-ddT:hh:mm:ss date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00')).toMatchObject({
      year: '2018',
      month: '05',
      day: '28',
      hour: '12',
      minute: '30',
      second: '00',
    });
  });

  it('parses yyyy-mm-ddT:hh:mm:ss+hh:mm date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00+05:30')).toMatchObject({
      year: '2018',
      month: '05',
      day: '28',
      hour: '12',
      minute: '30',
      second: '00',
      timeZoneOffset: '+05:30',
      sign: '+',
      timeZoneHour: '05',
      timeZoneMinute: '30',
    });
  });

  it('parses yyyy-mm-ddT:hh:mm:ss-hh:mm date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00-05:15')).toMatchObject({
      year: '2018',
      month: '05',
      day: '28',
      hour: '12',
      minute: '30',
      second: '00',
      timeZoneOffset: '-05:15',
      sign: '-',
      timeZoneHour: '05',
      timeZoneMinute: '15',
    });
  });

  it('parses yyyy-mm-ddT:hh:mm:ssZ date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00Z')).toMatchObject({
      year: '2018',
      month: '05',
      day: '28',
      hour: '12',
      minute: '30',
      second: '00',
      timeZoneOffset: 'Z',
    });
  });

  it('parses yyyy-mm-ddT:hh:mm:ss.fff date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00.123')).toMatchObject({
      year: '2018',
      month: '05',
      day: '28',
      hour: '12',
      minute: '30',
      second: '00',
      millisecond: '123',
    });
  });

  it('parses yyyy-mm-ddT:hh:mm:ss.fff+hh:mm date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00.123+05:30')).toMatchObject(
      {
        year: '2018',
        month: '05',
        day: '28',
        hour: '12',
        minute: '30',
        second: '00',
        millisecond: '123',
        timeZoneOffset: '+05:30',
        sign: '+',
        timeZoneHour: '05',
        timeZoneMinute: '30',
      },
    );
  });

  it('parses yyyy-mm-ddT:hh:mm:ss.fff-hh:mm date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00.123-05:15')).toMatchObject(
      {
        year: '2018',
        month: '05',
        day: '28',
        hour: '12',
        minute: '30',
        second: '00',
        millisecond: '123',
        timeZoneOffset: '-05:15',
        sign: '-',
        timeZoneHour: '05',
        timeZoneMinute: '15',
      },
    );
  });

  it('parses yyyy-mm-ddT:hh:mm:ss.fffZ date strings', () => {
    expect(parseDateStringParts('2018-05-28T12:30:00.123Z')).toMatchObject({
      year: '2018',
      month: '05',
      day: '28',
      hour: '12',
      minute: '30',
      second: '00',
      millisecond: '123',
      timeZoneOffset: 'Z',
    });
  });
});
