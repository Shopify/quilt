import {formatCurrency, formatStringCurrency} from '../money';

jest.mock('../translate', () => ({
  memoizedNumberFormatter: jest.fn(),
  memoizedStringNumberFormatter: jest.fn(),
}));

const memoizedNumberFormatterMock: jest.Mock =
  jest.requireMock('../translate').memoizedNumberFormatter;

const memoizedStringNumberFormatterMock: jest.Mock =
  jest.requireMock('../translate').memoizedStringNumberFormatter;

describe('formatCurrency()', () => {
  const mockFormat = jest.fn();

  beforeEach(() => {
    const mockFormatter = {
      format: mockFormat,
    };
    memoizedNumberFormatterMock.mockImplementation(() => mockFormatter);
    mockFormat.mockImplementation(() => 'test');
  });

  afterEach(() => {
    memoizedNumberFormatterMock.mockReset();
    mockFormat.mockReset();
  });

  it('uses memoizedNumberFormatter to get a memoized formatter with currency style', () => {
    const locale = 'en';
    const options = {
      currency: 'USD',
    };

    formatCurrency(123, locale, options);
    expect(memoizedNumberFormatterMock).toHaveBeenCalledWith(locale, {
      ...options,
      style: 'currency',
    });
  });

  it('calls format on the memoized formatter', () => {
    const amount = 123;
    const result = 'result';
    mockFormat.mockImplementation(() => result);

    expect(formatCurrency(amount, 'en', {})).toBe(result);
    expect(mockFormat).toHaveBeenCalledWith(amount);
  });
});

describe('formatStringCurrency()', () => {
  const mockFormat = jest.fn();

  beforeEach(() => {
    const mockFormatter = {
      format: mockFormat,
    };
    memoizedStringNumberFormatterMock.mockImplementation(() => mockFormatter);
    mockFormat.mockImplementation(() => 'test');
  });

  afterEach(() => {
    memoizedStringNumberFormatterMock.mockReset();
    mockFormat.mockReset();
  });

  it('uses memoizedNumberFormatter to get a memoized formatter with currency style', () => {
    const locale = 'en';
    const options = {
      currency: 'USD',
    };

    formatStringCurrency('123', locale, options);
    expect(memoizedStringNumberFormatterMock).toHaveBeenCalledWith(locale, {
      ...options,
      style: 'currency',
    });
  });

  it('calls format on the memoized formatter', () => {
    const amount = '123';
    const result = 'result';
    mockFormat.mockImplementation(() => result);

    expect(formatStringCurrency(amount, 'en', {})).toBe(result);
    expect(mockFormat).toHaveBeenCalledWith(amount);
  });
});
