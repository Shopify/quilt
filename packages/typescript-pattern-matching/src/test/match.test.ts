import match, {when, doMatch} from '../match';
import {isNull, isString, isShape} from '../matchers';

describe('match', () => {
  describe('currying syntax', () => {
    it('calls only expected handler for a given matcher when it returns true', () => {
      const value = 'string';
      const stringSpy = jest.fn();
      const nullSpy = jest.fn();

      // prettier-ignore
      doMatch(value)(
        when(isString)(stringSpy),
        when(isNull)(nullSpy),
      );

      expect(stringSpy).toBeCalled();
      expect(nullSpy).not.toBeCalled();
    });

    it('throws an error if no match is found', () => {
      const value = 2;
      const stringSpy = jest.fn();
      const nullSpy = jest.fn();

      expect(() => {
        doMatch(value)(
          // prettier-ignore
          when(isString)(stringSpy),
          when(isNull)(nullSpy),
        );
      }).toThrow();

      expect(stringSpy).not.toBeCalled();
      expect(nullSpy).not.toBeCalled();
    });

    it('works with isShape', () => {
      const value = {
        foo: 'foo',
        bar: 'bar',
      };

      const shapeSpy = jest.fn();
      const nullSpy = jest.fn();

      const isCorrectShape = isShape({
        foo: isString,
        bar: isString,
      });

      // prettier-ignore
      doMatch(value)(
        when(isCorrectShape)(shapeSpy),
        when(isNull)(nullSpy)
      );

      expect(shapeSpy).toBeCalled();
      expect(nullSpy).not.toBeCalled();
    });
  });

  describe('chaining syntax', () => {
    it('calls only expected handler for a given matcher when it returns true', () => {
      const value = 'string';
      const stringSpy = jest.fn();
      const nullSpy = jest.fn();

      match(value)
        .when(isString, stringSpy)
        .when(isNull, nullSpy)
        .execute();

      expect(stringSpy).toBeCalled();
      expect(nullSpy).not.toBeCalled();
    });

    it('throws an error if no match is found', () => {
      const value = 2;
      const stringSpy = jest.fn();
      const nullSpy = jest.fn();

      expect(() => {
        match(value)
          .when(isString, stringSpy)
          .when(isNull, nullSpy)
          .execute();
      }).toThrow();

      expect(stringSpy).not.toBeCalled();
      expect(nullSpy).not.toBeCalled();
    });

    it('works with isShape', () => {
      const value = {
        foo: 'foo',
        bar: 'bar',
      };

      const shapeSpy = jest.fn();
      const nullSpy = jest.fn();

      const isCorrectShape = isShape({
        foo: isString,
        bar: isString,
      });

      match(value)
        .when(isCorrectShape, shapeSpy)
        .when(isNull, nullSpy)
        .execute();

      expect(shapeSpy).toBeCalled();
      expect(nullSpy).not.toBeCalled();
    });

    it('does not match isShape if shape is wrong', () => {
      const value = {
        foo: 'foo',
        bar: 'bar',
      };

      const shapeSpy = jest.fn();
      const nullSpy = jest.fn();

      const isCorrectShape = isShape({
        foo: isString,
        baz: isString,
      });

      match(value)
        .when(isCorrectShape, shapeSpy)
        .other(jest.fn())
        .execute();

      expect(shapeSpy).not.toBeCalled();
    });

    it('returns return value from matching when', () => {
      const value = {
        foo: 'foo',
        bar: 'bar',
      };

      const shapeSpy = jest.fn();
      const nullSpy = jest.fn();

      const isCorrectShape = isShape({
        foo: isString,
        bar: isString,
      });

      const result = match<string>(value)
        .when(isCorrectShape, ({foo, bar}) => foo + bar)
        .when(isNull, nullSpy)
        .execute();

      expect(result).toBe(value.foo + value.bar);
    });

    it('calls _ if no other option matches', () => {
      const value = {
        baz: 123,
      };

      const fallbackSpy = jest.fn();

      const result = match<string>(value)
        .when(isNull, jest.fn())
        .other(fallbackSpy)
        .execute();

      expect(fallbackSpy).toBeCalled();
    });
  });

  describe('when', () => {});

  describe('match', () => {});
});
