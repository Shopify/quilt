import faker from 'faker';

import {
  createMockFactory,
  DeepOmitOptional,
  Primitive,
} from '../createMockFactory';

describe('Primitive', () => {
  const expectedValue = 'expected';
  type Test<T> = T extends Primitive ? undefined : typeof expectedValue;

  it('catches Object() constructor', () => {
    const object: Test<Object> = expectedValue;
    expect(object).toStrictEqual(expectedValue);
  });

  it('catches empty object {}', () => {
    const emptyObject: Test<{}> = expectedValue;
    expect(emptyObject).toStrictEqual(expectedValue);
  });

  it('catches interface types', () => {
    interface Person {
      name: string;
    }
    const person: Test<Person> = expectedValue;
    expect(person).toStrictEqual(expectedValue);
  });

  it('catches object interfaces', () => {
    interface Empty {}
    interface NotEmpty {
      [k: string]: unknown;
    }
    const notEmpty: Test<NotEmpty> = expectedValue;
    const empty: Test<Empty> = expectedValue;
    expect(notEmpty).toStrictEqual(expectedValue);
    expect(empty).toStrictEqual(expectedValue);
  });
});

describe('createMockFactory()', () => {
  describe('T', () => {
    it('returns static getter function', () => {
      interface Static {
        optional?: boolean;
        string: string;
        number: number;
        boolean: boolean;
        function: Function;
        nullValue: null;
        symbol: Symbol;
      }

      type NonNestable<T, Else = never> = T extends Primitive ? T : Else;

      const test: Static extends Primitive ? true : false = false;

      const mockFunction = () => 'mockFunction';
      const string: NonNestable<Static['string']> = 'hello';
      const number: NonNestable<Static['number']> = 2;
      const boolean: NonNestable<Static['boolean']> = true;
      const func: NonNestable<Static['function']> = mockFunction;
      const nullValue: NonNestable<Static['nullValue']> = null;
      const symbol: NonNestable<Static['symbol']> = Symbol('symbolic');

      const nestableInterface: NonNestable<Static, false> = false;
      const nestableObjectLiteral: NonNestable<
        {[key: string]: any},
        false
      > = false;

      expect({
        test,
        nestableInterface,
        nestableObjectLiteral,
      }).toStrictEqual({
        test,
        nestableInterface: false,
        nestableObjectLiteral: false,
      });

      const defaults: DeepOmitOptional<Static> = {
        string,
        number,
        boolean,
        function: func,
        nullValue,
        symbol,
      };
      const mockStatic = createMockFactory<Static>(defaults);
      expect(mockStatic()).toStrictEqual({
        ...defaults,
        function: mockFunction,
      });
    });

    it('returns dynamic nested getter function', () => {
      interface Dynamic {
        string: string;
        foo: {
          bar: boolean;
          deep: {
            string: string[];
            baz: number;
          };
        };
      }

      const mockStatic = createMockFactory<Dynamic>({
        string: faker.random.word(),
        foo: {
          bar: faker.random.boolean(),
          deep: {
            string: [faker.random.word()],
            baz: faker.random.number(),
          },
        },
      });
      const expected = mockStatic();
      expect(typeof expected.string).toStrictEqual('string');
      expect(typeof expected.foo.bar).toStrictEqual('boolean');
      expect(typeof expected.foo.deep.string[0]).toStrictEqual('string');
      expect(typeof expected.foo.deep.baz).toStrictEqual('number');
    });

    it('returns deeply merged partial overrides', () => {
      interface Dynamic {
        optional?: string;
        foo: {
          string: string;
          number: number;
          deep?: {
            bar: string;
          };
        };
      }

      const mockStatic = createMockFactory<Dynamic>({
        foo: {
          string: 'string',
          number: 2,
        },
      });
      expect(mockStatic({foo: {string: 'other'}}).foo.string).toStrictEqual(
        'other',
      );
      expect(mockStatic({foo: {deep: {bar: 'baz'}}})).toStrictEqual({
        foo: {
          deep: {
            bar: 'baz',
          },
          string: 'string',
          number: 2,
        },
      });
    });

    it('returns overrides from getter function', () => {
      interface Dynamic {
        optionalString?: string;
      }

      const mockStatic = createMockFactory<Dynamic>({});

      expect(mockStatic()).toStrictEqual({});
      expect(mockStatic({optionalString: 'test'})).toStrictEqual({
        optionalString: 'test',
      });
    });

    it('accepts falsey values', () => {
      interface Null {
        optional?: string | null;
      }

      const mockStatic = createMockFactory<Null>({});

      expect(mockStatic({optional: null})).toStrictEqual({optional: null});
      expect(mockStatic({optional: undefined})).toStrictEqual({
        optional: undefined,
      });
    });

    it('accepts nested falsey values', () => {
      interface Null {
        foo: {
          optional?: string | null;
        } | null;
      }

      const mockStatic = createMockFactory<Null>({
        foo: {},
      });

      expect(mockStatic({foo: {optional: null}})).toStrictEqual({
        foo: {optional: null},
      });
      expect(mockStatic({foo: {optional: undefined}})).toStrictEqual({
        foo: {optional: undefined},
      });
      expect(mockStatic({foo: null})).toStrictEqual({foo: null});
    });

    it('accepts nested interface types', () => {
      interface Product {
        name: string;
        optional?: boolean;
      }
      interface Props {
        product: Product;
        categoryId?: string;
      }

      const mockStatic = createMockFactory<Props>({
        product: {
          name: 'name',
        },
      });
      expect(mockStatic()).toStrictEqual({product: {name: 'name'}});
    });

    it('accepts tuples', () => {
      interface Test {
        tuple: [string, number];
      }

      const mockTest = createMockFactory<Test>({
        tuple: ['banana', 2],
      });

      expect(mockTest()).toStrictEqual({tuple: ['banana', 2]});
    });

    it('accepts unions', () => {
      interface Test {
        nullUnion: string | null;
        optionalNullUnion?: string | null;
        undefinedUnion: string | undefined;
        optionalUndefinedUnion?: string | undefined;
        multiplePrimitives: string | number;
        nullUnionObject: {
          name: string;
        } | null;
        optionalNullUnionObject?: {
          name: string;
        } | null;
      }

      const test: DeepOmitOptional<Test> = {
        multiplePrimitives: 'string',
        nullUnion: 'string',
        undefinedUnion: undefined,
        nullUnionObject: {name: ''},
        optionalNullUnionObject: undefined,
      };

      const mockTest = createMockFactory<Test>(test);

      expect(mockTest()).toStrictEqual(test);
    });

    it('accepts typed arrays', () => {
      interface Test {
        typedArray: string[];
      }

      const test: DeepOmitOptional<Test> = {
        typedArray: ['string', 'banana'],
      };

      const mockTest = createMockFactory<Test>(test);

      expect(mockTest()).toStrictEqual(test);
    });
  });

  describe('DeepRequired<T>', () => {
    it('accepts only required properties', () => {
      interface Static {
        optional?: boolean;
        requiredField: string;
      }

      const mockStatic = createMockFactory<Static>({
        requiredField: 'value',
      });
      expect(
        mockStatic<DeepOmitOptional<Static>>({
          optional: undefined,
        }),
      ).toStrictEqual({
        requiredField: 'value',
        optional: undefined,
      });
    });
  });
});
