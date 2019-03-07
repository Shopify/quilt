/**
 * @jest-environment node
 */

import memoize from '../memoize';

describe('memoize()', () => {
  describe('server', () => {
    it('recalculates the result when first argument changed', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize()
        addOne(number: number) {
          spy();
          return number + 1;
        }
      }

      const myClass = new MyClass();

      expect(myClass.addOne(1)).toEqual(2);
      expect(myClass.addOne(2)).toEqual(3);
      expect(spy).toBeCalledTimes(2);
    });

    it('recalculates the result when the first argument stay the same', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize()
        addOne(number: number) {
          spy();
          return number + 1;
        }
      }

      const myClass = new MyClass();

      expect(myClass.addOne(1)).toEqual(2);
      expect(myClass.addOne(1)).toEqual(2);
      expect(spy).toBeCalledTimes(2);
    });
  });
});
