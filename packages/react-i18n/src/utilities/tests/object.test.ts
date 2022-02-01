import {isObjectEmpty} from '../object';

describe('isObjectEmpty()', () => {
  it('return true if object is empty', () => {
    expect(isObjectEmpty({})).toBe(true);
  });

  it('return false if object is not empty', () => {
    expect(isObjectEmpty({foo: 'bar'})).toBe(false);
  });
});
