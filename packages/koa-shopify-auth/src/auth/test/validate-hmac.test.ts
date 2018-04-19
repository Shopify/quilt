import validateHmac from '../validate-hmac';

jest.mock('crypto', () => {
  return {
    createHmac() {
      return {
        update() {
          return this;
        },
        digest() {
          return 'somehmac';
        },
      };
    },
  };
});

jest.mock('safe-compare', () => {
  return jest.fn((first: string, second: string) => first === second);
});

const safeCompare = require.requireMock('safe-compare');
const data = {foo: 'bar'};
const secret = 'somehmac';

describe('validateHmac', () => {
  beforeEach(() => {});

  it('returns true when digest matches input', () => {
    const hmac = 'somehmac';
    expect(validateHmac(hmac, secret, data)).toBe(true);
  });

  it('returns false when digests does not match input', () => {
    const hmac = 'some invalid hmac';
    expect(validateHmac(hmac, secret, data)).toBe(false);
  });

  it('compares using safeCompare', () => {
    const hmac = 'some invalid hmac';
    expect(safeCompare).toBeCalledWith('somehmac', hmac);
  });
});
