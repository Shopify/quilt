/**
 * @jest-environment jsdom
 */

import memoize, {MAX_MAP_ENTRIES} from '../memoize';

describe('memoize()', () => {
  describe('client', () => {
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
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('gets the result from cache when the first argument stay the same', () => {
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
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('deletes oldest cache item when the cache limit is reached', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize()
        addOne(number: number) {
          spy();
          return number + 1;
        }
      }

      const myClass = new MyClass();

      for (let i = 0; i < MAX_MAP_ENTRIES; i++) {
        expect(myClass.addOne(i)).toEqual(i + 1);
      }

      // 0 is in the cache
      expect(myClass.addOne(0)).toEqual(1);
      expect(myClass.addOne(1)).toEqual(2);
      expect(spy).toHaveBeenCalledTimes(MAX_MAP_ENTRIES);

      expect(myClass.addOne(MAX_MAP_ENTRIES)).toEqual(MAX_MAP_ENTRIES + 1);
      expect(spy).toHaveBeenCalledTimes(MAX_MAP_ENTRIES + 1);

      // 0 is no longer in the cache
      expect(myClass.addOne(0)).toEqual(1);
      expect(spy).toHaveBeenCalledTimes(MAX_MAP_ENTRIES + 2);
    });
  });

  describe('only argument is object', () => {
    it('recalculates the result when the first argument changed', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize()
        getValues(someObject: Object) {
          spy();
          return Object.values(someObject);
        }
      }

      const myClass = new MyClass();

      expect(myClass.getValues({one: 1, two: 2})).toEqual([1, 2]);
      expect(myClass.getValues({one: 3, four: 4})).toEqual([3, 4]);
      expect(spy).toBeCalledTimes(2);
    });

    it('gets the result from cache when the first argument stay the same', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize()
        getValues(someObject: Object) {
          spy();
          return Object.values(someObject);
        }
      }

      const myClass = new MyClass();

      const testObject1 = {one: 1, two: 2};
      expect(myClass.getValues(testObject1)).toEqual([1, 2]);
      expect(myClass.getValues(testObject1)).toEqual([1, 2]);
      expect(spy).toBeCalledTimes(1);
    });

    it('does not change the result when the argument was changed in value only', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize()
        getValues(someObject: Object) {
          spy();
          return Object.values(someObject);
        }
      }

      const myClass = new MyClass();

      const testObject1 = {one: 1, two: 2};
      expect(myClass.getValues(testObject1)).toEqual([1, 2]);

      testObject1.one = 2;
      expect(myClass.getValues(testObject1)).toEqual([1, 2]);

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('customized resolver', () => {
    it('recalculates the result when the resolver result was changed', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize((_name: string, id: string) => id)
        getName(name: string, _id: string) {
          spy();
          return name;
        }
      }

      const myClass = new MyClass();

      expect(myClass.getName('Lisa', '1')).toEqual('Lisa');
      expect(myClass.getName('Lisa', '2')).toEqual('Lisa');
      expect(spy).toBeCalledTimes(2);
    });

    it('gets the result from cache when the resolver result was not changed', () => {
      const spy = jest.fn();
      class MyClass {
        @memoize((_name: string, id: string) => id)
        getName(name: string, _id: string) {
          spy();
          return name;
        }
      }

      const myClass = new MyClass();

      expect(myClass.getName('Lisa', '1')).toEqual('Lisa');
      expect(myClass.getName('Lisa', '1')).toEqual('Lisa');
      expect(spy).toBeCalledTimes(1);
    });
  });

  it('does not share cache result in two instances of the same class', () => {
    const spy = jest.fn();
    class MyClass {
      extraNumber = 0;
      constructor(extraNumber: number) {
        this.extraNumber = extraNumber;
      }

      @memoize()
      addExtraNumber(number: number) {
        spy();
        return number + this.extraNumber + 1;
      }
    }

    const myClass1 = new MyClass(1);
    expect(myClass1.addExtraNumber(1)).toEqual(3);

    const myClass2 = new MyClass(3);
    expect(myClass2.addExtraNumber(1)).toEqual(5);

    expect(spy).toBeCalledTimes(2);
  });
});
