import {format} from '..';

describe('format()', () => {
  const date = new Date(Date.UTC(2021, 0, 1, 1, 0, 0));

  it('handles YYYY-MM-DD', () => {
    expect(format(date, 'YYYY-MM-DD', 'UTC')).toBe('2021-01-01');
  });

  it('handles HH:mm', () => {
    expect(format(date, 'HH:mm', 'UTC')).toBe('01:00');
  });

  it('handles H:m', () => {
    expect(format(date, 'H:m', 'UTC')).toBe('1:0');
  });

  it('handles HH:mm:ss', () => {
    expect(format(date, 'HH:mm:ss', 'UTC')).toBe('01:00:00');
  });

  it('handles hh', () => {
    expect(format(date, 'hh', 'UTC')).toBe('01');
  });

  it('handles YY', () => {
    const yearTest = new Date(Date.UTC(2009, 1, 14, 15, 25, 50, 125));
    expect(format(yearTest, 'YY', 'UTC')).toBe('09');
  });

  it('handles ddd MMM DD YYYY HH:mm:ss', () => {
    const bigTest = new Date(Date.UTC(2009, 1, 5, 15, 25, 50, 125));
    expect(format(bigTest, 'ddd MMM DD YYYY HH:mm:ss', 'UTC')).toBe(
      'Thu Feb 05 2009 15:25:50',
    );
  });

  it('handles hmm and hmmss', () => {
    const test1 = new Date(Date.UTC(2021, 0, 1, 12, 34, 56));
    expect(format(test1, 'hmm', 'UTC')).toBe('1234');
    expect(format(test1, 'hmmss', 'UTC')).toBe('123456');
    const test2 = new Date(Date.UTC(2021, 0, 1, 1, 34, 56));
    expect(format(test2, 'hmm', 'UTC')).toBe('134');
    expect(format(test2, 'hmmss', 'UTC')).toBe('13456');
    const test3 = new Date(Date.UTC(2021, 0, 1, 13, 34, 56));
    expect(format(test3, 'hmm', 'UTC')).toBe('134');
    expect(format(test3, 'hmmss', 'UTC')).toBe('13456');
  });

  it('handles Hmm and Hmmss', () => {
    const test1 = new Date(Date.UTC(2021, 0, 1, 12, 34, 56));
    expect(format(test1, 'Hmm', 'UTC')).toBe('1234');
    expect(format(test1, 'Hmmss', 'UTC')).toBe('123456');
    const test2 = new Date(Date.UTC(2021, 0, 1, 1, 34, 56));
    expect(format(test2, 'Hmm', 'UTC')).toBe('134');
    expect(format(test2, 'Hmmss', 'UTC')).toBe('13456');
    const test3 = new Date(Date.UTC(2021, 0, 1, 13, 34, 56));
    expect(format(test3, 'Hmm', 'UTC')).toBe('1334');
    const test4 = new Date(Date.UTC(2021, 0, 1, 8, 34, 56));
    expect(format(test4, 'Hmmss', 'UTC')).toBe('83456');
    const test5 = new Date(Date.UTC(2021, 0, 1, 18, 34, 56));
    expect(format(test5, 'Hmmss', 'UTC')).toBe('183456');
  });

  it('handles one digit hours, minutes, and seconds', () => {
    const test1 = new Date(Date.UTC(2021, 0, 1, 1, 2, 3));
    expect(format(test1, 'hms', 'UTC')).toBe('123');
    expect(format(test1, 'Hms', 'UTC')).toBe('123');
  });

  it('handles many cases for a specific date', () => {
    const date = new Date(Date.UTC(2010, 1, 14, 15, 25, 50, 125));
    expect(format(date, 'dddd, MMMM D YYYY, h:mm:ss a', 'UTC')).toBe(
      'Sunday, February 14 2010, 3:25:50 pm',
    );
    expect(format(date, 'ddd, hA', 'UTC')).toBe('Sun, 3PM');
    expect(format(date, 'M MM MMMM MMM', 'UTC')).toBe('2 02 February Feb');
    expect(format(date, 'YYYY YY', 'UTC')).toBe('2010 10');
    expect(format(date, 'D DD', 'UTC')).toBe('14 14');
    expect(format(date, 'dddd ddd', 'UTC')).toBe('Sunday Sun');
    expect(format(date, 'h hh', 'UTC')).toBe('3 03');
    expect(format(date, 'H HH', 'UTC')).toBe('15 15');
    expect(format(date, 'm mm', 'UTC')).toBe('25 25');
    expect(format(date, 's ss', 'UTC')).toBe('50 50');
    expect(format(date, 'a A', 'UTC')).toBe('pm PM');
  });
});
