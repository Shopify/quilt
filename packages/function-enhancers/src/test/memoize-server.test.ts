/**
 * @jest-environment node
 */

import memoize from '../memoize';

describe('memoize()', () => {
  describe('server', () => {
    it('recalculates the result when first argument changed', () => {
      const spy = jest.fn();
      const addOne = (number: number) => {
        spy();
        return number + 1;
      };
      const addOneMemoized = memoize(addOne);

      expect(addOneMemoized(1)).toEqual(2);
      expect(addOneMemoized(2)).toEqual(3);
      expect(spy).toBeCalledTimes(2);
    });

    it('recalculates the result when the first argument stay the same', () => {
      const spy = jest.fn();
      const addOne = (number: number) => {
        spy();
        return number + 1;
      };
      const addOneMemoized = memoize(addOne);

      expect(addOneMemoized(1)).toEqual(2);
      expect(addOneMemoized(1)).toEqual(2);
      expect(spy).toBeCalledTimes(2);
    });
  });
});
