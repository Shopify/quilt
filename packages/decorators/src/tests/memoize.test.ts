/**
 * @jest-environment jsdom
 */

import memoize from '../memoize';

describe('memoize()', () => {
  it('gets the result from cache when decorating a property instance', () => {
    const spy = jest.fn();
    class MyClass {
      @memoize()
      addOne(number: number) {
        spy();
        return number + 1;
      }
    }

    const myClass = new MyClass();

    expect(myClass.addOne(1)).toBe(2);
    expect(myClass.addOne(1)).toBe(2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('gets the result from cache when decorating a property instance with customized resolver', () => {
    const spy = jest.fn();
    class MyClass {
      @memoize((_name: string, id: string) => id)
      getName(name: string, _id: string) {
        spy();
        return name;
      }
    }

    const myClass = new MyClass();

    expect(myClass.getName('Lisa', '1')).toBe('Lisa');
    expect(myClass.getName('Lisa', '1')).toBe('Lisa');
    expect(spy).toHaveBeenCalledTimes(1);
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
    expect(myClass1.addExtraNumber(1)).toBe(3);

    const myClass2 = new MyClass(3);
    expect(myClass2.addExtraNumber(1)).toBe(5);

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
