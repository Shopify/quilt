/**
 * @jest-environment jsdom
 */

import debounce from '../debounce';

describe('debounce()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('default: leading=false, trailing=true', () => {
    it('executes the debounced function immediately when wait time is not set', () => {
      const spy = jest.fn((value: string) => value);
      const debounced = debounce(spy);

      expect(debounced('a')).toBeUndefined();

      jest.advanceTimersByTime(0);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');
    });

    it('only executes the last of the debounced function calls after wait time elapsed', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait);

      expect(debounced('a')).toBeUndefined();
      expect(debounced('b')).toBeUndefined();
      expect(debounced('c')).toBeUndefined();

      jest.advanceTimersByTime(wait);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('c');
    });

    it('returns the result of the last executed debounced function calls', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait);

      expect(debounced('a')).toBeUndefined();
      expect(debounced('b')).toBeUndefined();
      expect(debounced('c')).toBeUndefined();

      jest.advanceTimersByTime(wait);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('c');

      expect(debounced('d')).toStrictEqual('c');
      expect(debounced('e')).toStrictEqual('c');
      expect(debounced('f')).toStrictEqual('c');

      jest.advanceTimersByTime(wait);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenLastCalledWith('f');
    });
  });

  describe('trailing=true, leading=false implied', () => {
    it('only executes the last of the debounced function calls after wait time elapsed', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {trailing: true});

      expect(debounced('a')).toBeUndefined();
      expect(debounced('b')).toBeUndefined();
      expect(debounced('c')).toBeUndefined();

      jest.advanceTimersByTime(wait);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('c');
    });

    it('returns the result of the last executed debounced function calls', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {trailing: true});

      expect(debounced('a')).toBeUndefined();
      expect(debounced('b')).toBeUndefined();
      expect(debounced('c')).toBeUndefined();

      jest.advanceTimersByTime(wait);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('c');

      expect(debounced('d')).toStrictEqual('c');
      expect(debounced('e')).toStrictEqual('c');
      expect(debounced('f')).toStrictEqual('c');

      jest.advanceTimersByTime(wait);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenLastCalledWith('f');
    });
  });

  describe('leading=true, trailing=true implied', () => {
    it('executes the debounced function immediately', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {leading: true});

      expect(debounced('a')).toStrictEqual('a');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');
    });

    it('executes the first of the debounced function calls', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {leading: true});

      expect(debounced('a')).toStrictEqual('a');
      expect(debounced('b')).toStrictEqual('a');
      expect(debounced('c')).toStrictEqual('a');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');
    });

    it('executes the first of the debounced function calls and last of the calls after wait time elapsed', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {leading: true});

      expect(debounced('a')).toStrictEqual('a');
      expect(debounced('b')).toStrictEqual('a');
      expect(debounced('c')).toStrictEqual('a');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');

      jest.advanceTimersByTime(wait);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenLastCalledWith('c');
    });
  });

  describe('leading=true & trailing=false', () => {
    it('executes the debounced function immediately', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {leading: true, trailing: false});

      expect(debounced('a')).toStrictEqual('a');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');
    });

    it('only executes the first of the debounced function calls', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {leading: true, trailing: false});

      expect(debounced('a')).toStrictEqual('a');
      expect(debounced('b')).toStrictEqual('a');
      expect(debounced('c')).toStrictEqual('a');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');
    });

    it('only executes the first of the debounced function calls after wait time elapsed', () => {
      const spy = jest.fn((value: string) => value);
      const wait = 100;
      const debounced = debounce(spy, wait, {leading: true, trailing: false});

      expect(debounced('a')).toStrictEqual('a');
      expect(debounced('b')).toStrictEqual('a');
      expect(debounced('c')).toStrictEqual('a');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');

      jest.advanceTimersByTime(wait);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('a');
    });
  });
});
