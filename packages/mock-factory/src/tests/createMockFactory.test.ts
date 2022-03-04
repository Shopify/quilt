import faker from '@faker-js/faker/locale/en';

import {createMockFactory} from '../createMockFactory';
import {DeepOmitOptional} from '../types';

interface Address {
  street: string;
  number: number;
  apartment?: boolean;
}
interface Person {
  name: string;
  address: Address;
  friends: Person[];
}

describe('createMockFactory()', () => {
  describe('default', () => {
    it('uses static value', () => {
      const mockPerson = createMockFactory<Person>({
        address: {
          street: 'Foo',
          number: 10,
        },
        name: 'Person',
        friends: [],
      });

      expect(mockPerson()).toStrictEqual({
        address: {
          street: 'Foo',
          number: 10,
        },
        name: 'Person',
        friends: [],
      });

      expect(mockPerson({name: 'Bar'})).toStrictEqual({
        address: {
          street: 'Foo',
          number: 10,
        },
        name: 'Bar',
        friends: [],
      });
    });

    it('uses dynamic value', () => {
      const mockDefaults = jest.fn(() => {
        return {
          street: faker.address.streetName(),
          number: 10,
        };
      });

      const mockAddress = createMockFactory<Address>(mockDefaults);

      mockAddress({number: 20});

      expect(mockDefaults).toHaveBeenCalled();
      expect(mockDefaults).toHaveBeenLastCalledWith({number: 20});
    });
  });

  describe('createMock()', () => {
    it('deeply merged overrides', () => {
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
      expect(mockStatic({foo: {string: 'other'}}).foo.string).toBe('other');
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
        // optionalNullUnionObject: undefined,
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

    it('uses custom `ReturnType`', () => {
      const mockAddress = createMockFactory<Address>({
        street: 'foo',
        number: 20,
      });

      interface ExtraAddres extends Address {
        apartment: boolean;
      }

      const onlyRequired = mockAddress<DeepOmitOptional<ExtraAddres>>({
        apartment: true,
      });

      expect(onlyRequired).toStrictEqual({
        street: 'foo',
        number: 20,
        apartment: true,
      });
    });

    it('mocks merged arrays', () => {
      const address = {
        street: 'street',
        number: 10,
      };
      const mockPerson = createMockFactory<Person>({
        name: 'Foo',
        address,
        friends: [{name: 'Bar', friends: [], address}],
      });

      expect(
        mockPerson({
          friends: [{name: 'Baz', address: {...address, number: 20}}],
        }).friends[0],
      ).toStrictEqual({
        name: 'Baz',
        friends: [],
        address: {
          ...address,
          number: 20,
        },
      });
    });

    it('mocks empty array', () => {
      const address = {
        street: 'street',
        number: 10,
      };
      const mockPerson = createMockFactory<Person>({
        name: 'Foo',
        address,
        friends: [{name: 'Bar', friends: [], address}],
      });

      expect(mockPerson({friends: []}).friends).toStrictEqual([]);
    });
  });
});
