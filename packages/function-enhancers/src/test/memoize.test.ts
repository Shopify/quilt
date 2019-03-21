/**
 * @jest-environment jsdom
 */

import memoize, {MAX_MAP_ENTRIES} from '../memoize';

describe('memoize()', () => {
  describe('client', () => {
    it('recalculates the result when first argument changed', () => {
      const spy = jest.fn();
      const addOne = (number: number) => {
        spy();
        return number + 1;
      };
      const addOneMemoized = memoize(addOne);

      expect(addOneMemoized(1)).toEqual(2);
      expect(addOneMemoized(2)).toEqual(3);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('gets the result from cache when the first argument stay the same', () => {
      const spy = jest.fn();
      const addOne = (number: number) => {
        spy();
        return number + 1;
      };
      const addOneMemoized = memoize(addOne);

      expect(addOneMemoized(1)).toEqual(2);
      expect(addOneMemoized(1)).toEqual(2);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('deletes oldest cache item when the cache limit is reached', () => {
      const spy = jest.fn();
      const addOne = (number: number) => {
        spy();
        return number + 1;
      };
      const addOneMemoized = memoize(addOne);

      for (let i = 0; i < MAX_MAP_ENTRIES; i++) {
        expect(addOneMemoized(i)).toEqual(i + 1);
      }

      // 0 is in the cache
      expect(addOneMemoized(0)).toEqual(1);
      expect(addOneMemoized(1)).toEqual(2);
      expect(spy).toHaveBeenCalledTimes(MAX_MAP_ENTRIES);

      expect(addOneMemoized(MAX_MAP_ENTRIES)).toEqual(MAX_MAP_ENTRIES + 1);
      expect(spy).toHaveBeenCalledTimes(MAX_MAP_ENTRIES + 1);

      // 0 is no longer in the cache
      expect(addOneMemoized(0)).toEqual(1);
      expect(spy).toHaveBeenCalledTimes(MAX_MAP_ENTRIES + 2);
    });
  });

  describe('only argument is object', () => {
    it('recalculates the result when the first argument changed', () => {
      const spy = jest.fn();
      const getValues = (someObject: Object) => {
        spy();
        return Object.values(someObject);
      };
      const getValuesMemoized = memoize(getValues);

      expect(getValuesMemoized({one: 1, two: 2})).toEqual([1, 2]);
      expect(getValuesMemoized({one: 3, four: 4})).toEqual([3, 4]);
      expect(spy).toBeCalledTimes(2);
    });

    it('gets the result from cache when the first argument stay the same', () => {
      const spy = jest.fn();
      const getValues = (someObject: Object) => {
        spy();
        return Object.values(someObject);
      };
      const getValuesMemoized = memoize(getValues);

      const testObject1 = {one: 1, two: 2};
      expect(getValuesMemoized(testObject1)).toEqual([1, 2]);
      expect(getValuesMemoized(testObject1)).toEqual([1, 2]);
      expect(spy).toBeCalledTimes(1);
    });

    it('does not change the result when the argument was changed in value only', () => {
      const spy = jest.fn();
      const getValues = (someObject: Object) => {
        spy();
        return Object.values(someObject);
      };
      const getValuesMemoized = memoize(getValues);

      const testObject1 = {one: 1, two: 2};
      expect(getValuesMemoized(testObject1)).toEqual([1, 2]);

      testObject1.one = 2;
      expect(getValuesMemoized(testObject1)).toEqual([1, 2]);

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('customized resolver', () => {
    it('recalculates the result when the resolver result was changed', () => {
      const spy = jest.fn();
      const getNameSpy = (name: string, _id: string) => {
        spy();
        return name;
      };
      const getNameMemoized = memoize(
        getNameSpy,
        (_name: string, id: string) => id,
      );

      expect(getNameMemoized('Lisa', '1')).toEqual('Lisa');
      expect(getNameMemoized('Lisa', '2')).toEqual('Lisa');
      expect(spy).toBeCalledTimes(2);
    });

    it('gets the result from cache when the resolver result was not changed', () => {
      const spy = jest.fn();
      const getNameSpy = (name: string, _id: string) => {
        spy();
        return name;
      };
      const getNameMemoized = memoize(
        getNameSpy,
        (_name: string, id: string) => id,
      );

      expect(getNameMemoized('Lisa', '1')).toEqual('Lisa');
      expect(getNameMemoized('Lisa', '1')).toEqual('Lisa');
      expect(spy).toBeCalledTimes(1);
    });
  });
});
