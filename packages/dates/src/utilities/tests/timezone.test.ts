import {getIanaTimeZone} from '../timezone';

jest.mock('../formatDate', () => ({
  memoizedGetDateTimeFormat: jest.fn(),
}));

const memoizedGetDateTimeFormatMock: jest.Mock = jest.requireMock(
  '../formatDate',
).memoizedGetDateTimeFormat;

describe('getIanaTimeZone()', () => {
  const resolvedOptionsMock = jest.fn();

  beforeEach(() => {
    const mockFormatter = {
      resolvedOptions: resolvedOptionsMock,
    };
    memoizedGetDateTimeFormatMock.mockImplementation(() => mockFormatter);
    resolvedOptionsMock.mockImplementation(() => ({
      timeZone: 'America/Vancouver',
    }));
  });

  afterEach(() => {
    memoizedGetDateTimeFormatMock.mockReset();
    resolvedOptionsMock.mockReset();
  });

  it('uses memoizedGetDateTimeFormat to get a memoized formatter', () => {
    const locale = 'en';
    const options: Intl.DateTimeFormatOptions = {
      timeZoneName: 'short',
    };

    getIanaTimeZone(locale, options);
    expect(memoizedGetDateTimeFormatMock).toHaveBeenCalledWith(locale, options);
  });

  it('returns the timeZone from the memoized formatter resolved options', () => {
    const timeZone = 'testing';
    resolvedOptionsMock.mockImplementation(() => ({timeZone}));

    expect(getIanaTimeZone('en', {})).toBe(timeZone);
    expect(resolvedOptionsMock).toHaveBeenCalled();
  });
});
