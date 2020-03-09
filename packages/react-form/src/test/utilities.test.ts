import {shallowArrayComparison, isChangeEvent} from '../utilities';

describe('shallowArrayComparison()', () => {
  describe('when the two arrays are the same', () => {
    it('returns true', () => {
      const array1 = [1, 'a', 2, 'b'];
      const array2 = [1, 'a', 2, 'b'];

      expect(shallowArrayComparison(array1, array2)).toBe(true);
    });
  });

  describe('when the two arrays are not the same', () => {
    it('returns true', () => {
      const array1 = [1, 'a', 2, 'b'];
      const array2 = ['other', 'stuff', 'in', 'here'];

      expect(shallowArrayComparison(array1, array2)).toBe(false);
    });
  });
});

describe('isChangeEvent', () => {
  it('returns false on null', () => {
    expect(isChangeEvent(null)).toBe(false);
  });
});
