import validateHmac from '../validate-hmac';

jest.mock('safe-compare', () => {
  return jest.fn((first: string, second: string) => first === second);
});

const safeCompare = require.requireMock('safe-compare');
const data = {fiz: 'buzz', foo: 'bar'};
const secret = 'some secret';
const hmac = '7c66606415117ff9744a2a9b2be1712a15928b5ef474ab1a9ff5dc36b7dcaed8';

describe('validateHmac', () => {
  beforeEach(() => {
    safeCompare.mockClear();
  });

  it('returns true when digest matches input', () => {
    expect(validateHmac(hmac, secret, data)).toBe(true);
  });

  it('returns false when digests does not match input', () => {
    expect(validateHmac('not actually an hmac', secret, data)).toBe(false);
  });

  it('compares using safeCompare', () => {
    validateHmac(hmac, secret, data);
    expect(safeCompare).toBeCalledWith(hmac, hmac);
  });

  it('works when the query params are ordered differently', () => {
    expect(validateHmac(hmac, secret, {foo: 'bar', fiz: 'buzz'})).toBe(true);
  });
});
