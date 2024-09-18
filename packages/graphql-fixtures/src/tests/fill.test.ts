// eslint-disable-next-line @shopify/typescript/prefer-build-client-schema
import {buildSchema} from 'graphql';
import type {DocumentNode} from 'graphql-typed';
import {parse} from 'graphql-typed';
import {faker as originalFaker} from '@faker-js/faker/locale/en';

import type {Options} from '../fill';
import {createFillers, list, faker} from '../fill';

jest.mock('../utilities', () => {
  const utilities = jest.requireActual('../utilities');
  return {
    ...utilities,
    chooseNull: jest.fn(() => false),
  };
});

const chooseNull: jest.Mock = jest.requireMock('../utilities').chooseNull;

describe('createFillers()', () => {
  beforeEach(() => {
    chooseNull.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fillOperation', () => {
    it('fills string fields', () => {
      const {fillOperation} = createFillerForSchema(`
        type Query {
          name: String!
        }
      `);

      const document = createDocument(`
        query Details {
          name
        }
      `);

      expect(fillOperation(document)).toStrictEqual({
        name: expect.any(String),
      });
    });

    it('fills integer fields', () => {
      const {fillOperation} = createFillerForSchema(`
        type Query {
          age: Int!
        }
      `);

      const document = createDocument<{age: number}>(`
        query Details {
          age
        }
      `);

      const {age} = fillOperation(document);
      expect(age).toStrictEqual(expect.any(Number));
      expect(Math.round(age)).toBe(age);
    });

    it('fills float fields', () => {
      const {fillOperation} = createFillerForSchema(`
        type Query {
          age: Float!
        }
      `);

      const document = createDocument<{age: number}>(`
        query Details {
          age
        }
      `);

      const {age} = fillOperation(document);
      expect(age).toStrictEqual(expect.any(Number));
      expect(Math.round(age)).not.toBe(age);
    });

    it('fills boolean fields', () => {
      const {fillOperation} = createFillerForSchema(`
        type Query {
          happy: Boolean!
        }
      `);

      const document = createDocument(`
        query Details {
          happy
        }
      `);

      expect(fillOperation(document)).toStrictEqual({
        happy: expect.any(Boolean),
      });
    });

    it('fills ID fields', () => {
      const {fillOperation} = createFillerForSchema(`
        type Query {
          id: ID!
        }
      `);

      const document = createDocument(`
        query Details {
          id
        }
      `);

      expect(fillOperation(document)).toStrictEqual({
        id: expect.any(String),
      });
    });

    it('fills enum fields', () => {
      const {fillOperation} = createFillerForSchema(`
        enum PetPreference {
          DOG
          CAT
        }

        type Query {
          petPreference: PetPreference!
        }
      `);

      const document = createDocument(`
        query Details {
          petPreference
        }
      `);

      expect(fillOperation(document)).toStrictEqual({
        petPreference: expect.stringMatching(/^(DOG|CAT)$/),
      });
    });

    it('fills custom scalar fields', () => {
      const {fillOperation} = createFillerForSchema(`
        scalar Date

        type Query {
          birthday: Date!
        }
      `);

      const document = createDocument(`
        query Details {
          birthday
        }
      `);

      expect(fillOperation(document)).toStrictEqual({
        birthday: expect.any(String),
      });
    });

    it('uses null sometimes for nullable fields', () => {
      chooseNull.mockReturnValue(true);

      const {fillOperation} = createFillerForSchema(`
        type Query {
          name: String
        }
      `);

      const document = createDocument(`
        query Details {
          name
        }
      `);

      expect(fillOperation(document)).toStrictEqual({
        name: null,
      });
    });
  });

  describe('fillFragment', () => {
    it('fills string fields', () => {
      const {fillFragment} = createFillerForSchema(`
        type Person {
          name: String!
        }
      `);

      const fragment = createDocument(`
        fragment PersonFragment on Person {
          name
        }
      `);

      expect(fillFragment(fragment)).toStrictEqual({
        name: expect.any(String),
      });
    });

    it('fills integer fields', () => {
      const {fillFragment} = createFillerForSchema(`
        type Person {
          age: Int!
        }
      `);

      const fragment = createDocument<{age: number}>(`
        fragment PersonFragment on Person {
          age
        }
      `);

      const {age} = fillFragment(fragment);
      expect(age).toStrictEqual(expect.any(Number));
      expect(Math.round(age)).toBe(age);
    });

    it('fills float fields', () => {
      const {fillFragment} = createFillerForSchema(`
        type Person {
          age: Float!
        }
      `);

      const fragment = createDocument<{age: number}>(`
        fragment PersonFragment on Person {
          age
        }
      `);

      const {age} = fillFragment(fragment);
      expect(age).toStrictEqual(expect.any(Number));
      expect(Math.round(age)).not.toBe(age);
    });

    it('fills boolean fields', () => {
      const {fillFragment} = createFillerForSchema(`
        type Person {
          happy: Boolean!
        }
      `);

      const fragment = createDocument(`
        fragment PersonFragment on Person {
          happy
        }
      `);

      expect(fillFragment(fragment)).toStrictEqual({
        happy: expect.any(Boolean),
      });
    });

    it('fills ID fields', () => {
      const {fillFragment} = createFillerForSchema(`
        type Person {
          id: ID!
        }
      `);

      const fragment = createDocument(`
        fragment PersonFragment on Person {
          id
        }
      `);

      expect(fillFragment(fragment)).toStrictEqual({
        id: expect.any(String),
      });
    });

    it('fills enum fields', () => {
      const {fillFragment} = createFillerForSchema(`
        enum PetPreference {
          DOG
          CAT
        }

        type Person {
          petPreference: PetPreference!
        }
      `);

      const fragment = createDocument(`
        fragment PersonFragment on Person {
          petPreference
        }
      `);

      expect(fillFragment(fragment)).toStrictEqual({
        petPreference: expect.stringMatching(/^(DOG|CAT)$/),
      });
    });

    it('fills custom scalar fields', () => {
      const {fillFragment} = createFillerForSchema(`
        scalar Date

        type Person {
          birthday: Date!
        }
      `);

      const fragment = createDocument(`
        fragment PersonFragment on Person {
          birthday
        }
      `);

      expect(fillFragment(fragment)).toStrictEqual({
        birthday: expect.any(String),
      });
    });

    it('uses null sometimes for nullable fields', () => {
      chooseNull.mockReturnValue(true);

      const {fillFragment} = createFillerForSchema(`
        type Person {
          name: String
        }
      `);

      const document = createDocument(`
        fragment PersonFragment on Person {
          name
        }
      `);

      expect(fillFragment(document)).toStrictEqual({
        name: null,
      });
    });
  });

  describe('randomness', () => {
    const {fillOperation, fillFragment} = createFillerForSchema(`
      scalar Date

      enum PetPreference {
        DOG
        CAT
      }

      type Person {
        name: String!
        petPreference: PetPreference!
        birthday: Date!
        parents: [Person!]!
      }

      enum CountryCode {
        CA
        US
        GB
      }

      enum CurrencyCode {
        CAD
        USD
        GBP
      }

      type LocalizationCollection {
        countryCodes: [CountryCode!]!
        currencyCodes: [CurrencyCode!]!
      }

      type Query {
        self: Person!
        sibling: Person
        localizations: [LocalizationCollection!]!
      }
    `);

    it('uses the same value for a given keypath', () => {
      const document = createDocument(`
        query Details {
          self { name, petPreference, birthday }
          sibling { name }
        }
      `);

      expect(fillOperation(document)).toStrictEqual(fillOperation(document));
    });

    it('uses different values for same fragment', () => {
      const fragment = createDocument(`
        fragment PersonFragment on Person {
          name
        }
      `);

      expect(fillFragment(fragment)).not.toStrictEqual(fillFragment(fragment));
    });

    it('uses different values for different keypaths', () => {
      const selfDocument = createDocument<{self: {name: string}}>(`
        query Details {
          self { name }
        }
      `);

      const meDocument = createDocument<{me: {name: string}}>(`
        query Details {
          me: self { name }
        }
      `);

      expect(fillOperation(selfDocument).self).not.toStrictEqual(
        fillOperation(meDocument).me,
      );
    });

    it('uses different values for different fragment', () => {
      const fragment = createDocument(`
        fragment PersonFragment on Person {
          name
        }
      `);

      const otherFragment = createDocument(`
        fragment OtherPersonFragment on Person {
          name
        }
      `);

      expect(fillFragment(fragment)).not.toStrictEqual(
        fillFragment(otherFragment),
      );
    });

    it('uses different values for a list of keypaths', () => {
      const document = createDocument<{
        self: {parents: {name: string}[]};
      }>(`
      query Details {
        self { parents { name } }
      }
      `);

      const data = fillOperation(document, {self: {parents: () => [{}, {}]}});

      expect(data.self.parents[0].name).not.toStrictEqual(
        data.self.parents[1].name,
      );
    });

    it('does not excessively seed the faker instance for prefilled data', () => {
      const spy = jest.spyOn(faker, 'seed');

      const document = createDocument<{
        self: {parents: {name: string}[]};
      }>(`
      query SeedCheck {
        localizations {
          countryCodes
          currencyCodes
        }
      }
      `);

      const data = fillOperation(document, {
        localizations: Array.from({length: 20}).map(() => ({
          countryCodes: Array.from({length: 250}).map(() => 'CA'),
          currencyCodes: Array.from({length: 150}).map(() => 'CAD'),
        })),
      });

      expect(spy.mock.calls.length).toBeLessThan(100);
    });
  });

  describe('objects', () => {
    describe('fillOperation', () => {
      it('fills nested objects', () => {
        const {fillOperation} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
          }

          type Query {
            self: Person!
          }
        `);

        const document = createDocument(`
          query Details {
            self {
              name
              mother {
                name
              }
            }
          }
        `);

        expect(fillOperation(document)).toStrictEqual({
          self: {
            name: expect.any(String),
            mother: {
              name: expect.any(String),
            },
          },
        });
      });

      it('uses a partial value', () => {
        const name = 'Chris';

        const {fillOperation} = createFillerForSchema(`
          type Query {
            age: Int!
            name: String!
          }
        `);

        const document = createDocument<any, {name?: string | null}>(`
          query Details {
            age
            name
          }
        `);

        expect(fillOperation(document, {name})).toStrictEqual({
          age: expect.any(Number),
          name,
        });
      });

      it('uses a function partial value', () => {
        const name = 'Chris';

        const {fillOperation} = createFillerForSchema(`
          type Query {
            age: Int!
            name: String!
          }
        `);

        const document = createDocument<any, {name?: string | null}>(`
          query Details {
            age
            name
          }
        `);

        expect(fillOperation(document, {name: () => name})).toStrictEqual({
          age: expect.any(Number),
          name,
        });
      });

      it('uses a partial value for nested fields', () => {
        const motherName = faker.person.firstName();
        const {fillOperation} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
          }

          type Query {
            self: Person!
          }
        `);

        const document = createDocument<
          any,
          {
            self?: {
              name?: string | null;
              mother?: {name?: string | null} | null;
            } | null;
          }
        >(`
          query Details {
            self {
              name
              mother {
                name
              }
            }
          }
        `);

        expect(
          fillOperation(document, {self: {mother: {name: motherName}}}),
        ).toStrictEqual({
          self: {
            name: expect.any(String),
            mother: {
              name: motherName,
            },
          },
        });
      });

      it('uses a function partial value for nested fields', () => {
        const motherName = faker.person.firstName();
        const {fillOperation} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
          }

          type Query {
            self: Person!
          }
        `);

        const document = createDocument<
          any,
          {
            self?: {
              name?: string | null;
              mother?: {name?: string | null} | null;
            } | null;
          }
        >(`
          query Details {
            self {
              name
              mother {
                name
              }
            }
          }
        `);

        expect(
          fillOperation(document, {
            self: () => ({
              mother: {name: () => motherName},
            }),
          }),
        ).toStrictEqual({
          self: {
            name: expect.any(String),
            mother: {
              name: motherName,
            },
          },
        });
      });

      it('fills an object that can be null with the object even if empty', () => {
        chooseNull.mockReturnValue(true);
        const {fillOperation} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
            sister: Person
          }

          type Query {
            self: Person!
          }
        `);

        const document = createDocument(`
          query Details {
            self {
              name
              sister {
                name
              }
            }
          }
        `);

        expect(
          fillOperation(document, {
            self: {
              sister: {},
            },
          }),
        ).toStrictEqual({
          self: {
            name: expect.any(String),
            sister: {
              name: expect.any(String),
            },
          },
        });
      });

      it('always uses null when explicitly set', () => {
        chooseNull.mockReturnValue(false);

        const {fillOperation} = createFillerForSchema(`
          type Sister {
            age: Int!
          }

          type Person {
            name: String!
            mother: Person!
            sister: Sister
          }

          type Query {
            self: Person!
          }
        `);

        const document = createDocument(`
          query Details {
            self {
              sister {
                age
              }
            }
          }
        `);

        expect(fillOperation(document, {self: {sister: null}})).toStrictEqual({
          self: {sister: null},
        });
      });

      it('always uses null when explicitly set in a resolver', () => {
        chooseNull.mockReturnValue(false);

        const {fillOperation} = createFillerForSchema(
          `
          type Sister {
            age: Int!
          }

          type Person {
            name: String!
            mother: Person!
            sister: Sister
          }

          type Query {
            self: Person!
          }
        `,
          {
            resolvers: {
              Sister: () => null,
            },
          },
        );

        const document = createDocument(`
          query Details {
            self {
              sister {
                age
              }
            }
          }
        `);

        expect(fillOperation(document, {self: {sister: null}})).toStrictEqual({
          self: {sister: null},
        });
      });
    });

    describe('fillFragment', () => {
      it('fills nested objects', () => {
        const {fillFragment} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
          }

          type Query {
            self: Person!
          }
        `);

        const fragment = createDocument(`
          fragment Details on Query {
            self {
              name
              mother {
                name
              }
            }
          }
        `);

        expect(fillFragment(fragment)).toStrictEqual({
          self: {
            name: expect.any(String),
            mother: {
              name: expect.any(String),
            },
          },
        });
      });

      it('uses a partial value', () => {
        const name = 'Chris';

        const {fillFragment} = createFillerForSchema(`
          type Query {
            age: Int!
            name: String!
          }
        `);

        const fragment = createDocument<any, {name?: string | null}>(`
          fragment Details on Query {
            age
            name
          }
        `);

        expect(fillFragment(fragment, {name})).toStrictEqual({
          age: expect.any(Number),
          name,
        });
      });

      it('uses a function partial value', () => {
        const name = 'Chris';

        const {fillFragment} = createFillerForSchema(`
          type Query {
            age: Int!
            name: String!
          }
        `);

        const fragment = createDocument<any, {name?: string | null}>(`
          fragment Details on Query {
            age
            name
          }
        `);

        expect(fillFragment(fragment, {name: () => name})).toStrictEqual({
          age: expect.any(Number),
          name,
        });
      });

      it('uses a partial value for nested fields', () => {
        const motherName = faker.person.firstName();
        const {fillFragment} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
          }

          type Query {
            self: Person!
          }
        `);

        const fragment = createDocument<
          any,
          {
            self?: {
              name?: string | null;
              mother?: {name?: string | null} | null;
            } | null;
          }
        >(`
          fragment Details on Query {
            self {
              name
              mother {
                name
              }
            }
          }
        `);

        expect(
          fillFragment(fragment, {self: {mother: {name: motherName}}}),
        ).toStrictEqual({
          self: {
            name: expect.any(String),
            mother: {
              name: motherName,
            },
          },
        });
      });

      it('uses a function partial value for nested fields', () => {
        const motherName = faker.person.firstName();
        const {fillFragment} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
          }

          type Query {
            self: Person!
          }
        `);

        const fragment = createDocument<
          any,
          {
            self?: {
              name?: string | null;
              mother?: {name?: string | null} | null;
            } | null;
          }
        >(`
          fragment Details on Query {
            self {
              name
              mother {
                name
              }
            }
          }
        `);

        expect(
          fillFragment(fragment, {
            self: () => ({
              mother: {name: () => motherName},
            }),
          }),
        ).toStrictEqual({
          self: {
            name: expect.any(String),
            mother: {
              name: motherName,
            },
          },
        });
      });

      it('fills an object that can be null with the object even if empty', () => {
        chooseNull.mockReturnValue(true);
        const {fillFragment} = createFillerForSchema(`
          type Person {
            name: String!
            mother: Person!
            sister: Person
          }

          type Query {
            self: Person!
          }
        `);

        const fragment = createDocument(`
          fragment Details on Query {
            self {
              name
              sister {
                name
              }
            }
          }
        `);

        expect(
          fillFragment(fragment, {
            self: {
              sister: {},
            },
          }),
        ).toStrictEqual({
          self: {
            name: expect.any(String),
            sister: {
              name: expect.any(String),
            },
          },
        });
      });

      it('always uses null when explicitly set', () => {
        chooseNull.mockReturnValue(false);

        const {fillFragment} = createFillerForSchema(`
          type Sister {
            age: Int!
          }

          type Person {
            name: String!
            mother: Person!
            sister: Sister
          }

          type Query {
            self: Person!
          }
        `);

        const fragment = createDocument(`
          fragment Details on Query {
            self {
              sister {
                age
              }
            }
          }
        `);

        expect(fillFragment(fragment, {self: {sister: null}})).toStrictEqual({
          self: {sister: null},
        });
      });

      it('always uses null when explicitly set in a resolver', () => {
        chooseNull.mockReturnValue(false);

        const {fillFragment} = createFillerForSchema(
          `
          type Sister {
            age: Int!
          }

          type Person {
            name: String!
            mother: Person!
            sister: Sister
          }

          type Query {
            self: Person!
          }
        `,
          {
            resolvers: {
              Sister: () => null,
            },
          },
        );

        const fragment = createDocument(`
          fragment Details on Query {
            self {
              sister {
                age
              }
            }
          }
        `);

        expect(fillFragment(fragment, {self: {sister: null}})).toStrictEqual({
          self: {sister: null},
        });
      });
    });

    describe('typename', () => {
      function createFillerForBasicObjectSchema(options?: Options) {
        return createFillerForSchema(
          `
            type Person {
              name: String!
            }

            type Query {
              self: Person!
            }
          `,
          options,
        );
      }

      describe('fillOperation', () => {
        it('fills with the actual typename of a parent object field', () => {
          const {fillOperation} = createFillerForBasicObjectSchema();

          const document = createDocument(`
            query Details {
              __typename
              self {
                __typename
                type: __typename
              }
            }
          `);

          expect(fillOperation(document)).toStrictEqual({
            __typename: 'Query',
            self: {
              __typename: 'Person',
              type: 'Person',
            },
          });
        });
      });

      describe('fillFragment', () => {
        it('fills with the actual typename of a parent object field', () => {
          const {fillFragment} = createFillerForBasicObjectSchema();

          const fragment = createDocument(`
            fragment Details on Query {
              __typename
              self {
                __typename
                type: __typename
              }
            }
          `);

          expect(fillFragment(fragment)).toStrictEqual({
            __typename: 'Query',
            self: {
              __typename: 'Person',
              type: 'Person',
            },
          });
        });
      });
    });

    describe('interfaces', () => {
      function createInterfaceSchema() {
        return buildSchema(`
          interface Named {
            name: String!
          }

          type Person implements Named {
            name: String!
            occupation: String!
          }

          type Dog implements Named {
            name: String!
            legs: Int!
          }

          type Cat implements Named {
            name: String!
            livesLeft: Int!
          }

          type Query {
            named: Named!
          }
        `);
      }

      function createFillerForInterfaceSchema(options?: Options) {
        const {fillOperation, fillFragment} = createFillers(
          createInterfaceSchema(),
          options,
        );
        return {
          fillFragment,
          fillOperation(document: DocumentNode, data?: any) {
            return fillOperation(
              document,
              data,
            )({
              query: document,
            });
          },
        };
      }

      describe('fillOperation', () => {
        it('picks a random implementing type', () => {
          const {fillOperation} = createFillerForInterfaceSchema();
          const document = createDocument(`
            query Details {
              named {
                __typename
                name
                ...on Person {
                  occupation
                }
                ...on Cat {
                  livesLeft
                }
              }
            }
          `);

          const possibleResults = [
            {
              named: {
                __typename: 'Person',
                name: expect.any(String),
                occupation: expect.any(String),
              },
            },
            {
              named: {
                __typename: 'Cat',
                name: expect.any(String),
                livesLeft: expect.any(Number),
              },
            },
            {
              named: {
                __typename: 'Dog',
                name: expect.any(String),
              },
            },
          ];

          // The result of fillOperation is random based on a seed.
          // Its value should be one of items in the possibleResults array
          expect(possibleResults).toStrictEqual(
            expect.arrayContaining([fillOperation(document)]),
          );
        });

        it('always picks the same implementing type', () => {
          const {fillOperation} = createFillerForInterfaceSchema();
          const document = createDocument(`
            query Details {
              named {
                __typename
              }
            }
          `);

          expect(fillOperation(document)).toStrictEqual(
            fillOperation(document),
          );
        });

        it('picks an implementing type based on a static typename provided', () => {
          const {fillOperation} = createFillerForInterfaceSchema();
          const document = createDocument(`
            query Details {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillOperation(document, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks an implementing type based on a function-provided typename provided', () => {
          const {fillOperation} = createFillerForInterfaceSchema();
          const document = createDocument(`
            query Details {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillOperation(document, {named: {__typename: () => 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks an implementing type based on a function-provided object with typename provided', () => {
          const {fillOperation} = createFillerForInterfaceSchema();
          const document = createDocument(`
            query Details {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillOperation(document, {
              named: () => ({__typename: () => 'Person'}),
            }),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('uses a resolver value for the selected type', () => {
          const person = {occupation: 'Carpenter'};
          const {fillOperation} = createFillerForInterfaceSchema({
            resolvers: {
              Person: () => person,
            },
          });
          const document = createDocument(`
            query Details {
              named {
                __typename
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillOperation(document, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              __typename: 'Person',
              ...person,
            },
          });
        });

        it('calls a resolver with the request and field details', () => {
          const spy = jest.fn(() => ({}));
          const schema = createInterfaceSchema();
          const {fillOperation} = createFillers(schema, {
            resolvers: {
              Person: spy,
            },
          });

          const document = createDocument(`
            query Details {
              namedPerson: named {
                __typename
                ...on Person {
                  occupation
                }
              }
            }
          `);

          const request = {
            query: document,
          };

          fillOperation(document, {namedPerson: {__typename: 'Person'}})(
            request,
          );

          expect(spy).toHaveBeenCalledWith(request, {
            type: schema.getType('Person'),
            parent: schema.getQueryType(),
            field: expect.objectContaining({
              fieldName: 'named',
              responseName: 'namedPerson',
            }),
            parentFields: [],
          });
        });

        it('throws an error when a provided typename is not an implementing type', () => {
          const {fillOperation} = createFillerForInterfaceSchema();
          const document = createDocument(`
            query Details {
              named {
                __typename
              }
            }
          `);

          expect(() =>
            fillOperation(document, {named: {__typename: 'Mule'}}),
          ).toThrow(/No type found/);
        });
      });

      describe('fillFragment', () => {
        it('picks a random implementing type', () => {
          const {fillFragment} = createFillerForInterfaceSchema();
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                __typename
                name
                ...on Person {
                  occupation
                }
                ...on Cat {
                  livesLeft
                }
              }
            }
          `);

          const possibleResults = [
            {
              named: {
                __typename: 'Person',
                name: expect.any(String),
                occupation: expect.any(String),
              },
            },
            {
              named: {
                __typename: 'Cat',
                name: expect.any(String),
                livesLeft: expect.any(Number),
              },
            },
            {
              named: {
                __typename: 'Dog',
                name: expect.any(String),
              },
            },
          ];

          // The result of fillFragment is random based on a seed.
          // Its value should be one of items in the possibleResults array
          expect(possibleResults).toStrictEqual(
            expect.arrayContaining([fillFragment(fragment)]),
          );
        });

        it('picks an implementing type based on a static typename provided', () => {
          const {fillFragment} = createFillerForInterfaceSchema();
          const fragment = createDocument(`
            fragment Details on Query{
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks an implementing type based on a function-provided typename provided', () => {
          const {fillFragment} = createFillerForInterfaceSchema();
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {named: {__typename: () => 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks an implementing type based on a function-provided object with typename provided', () => {
          const {fillFragment} = createFillerForInterfaceSchema();
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {
              named: () => ({__typename: () => 'Person'}),
            }),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('uses a resolver value for the selected type', () => {
          const person = {occupation: 'Carpenter'};
          const {fillFragment} = createFillerForInterfaceSchema({
            resolvers: {
              Person: () => person,
            },
          });
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                __typename
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              __typename: 'Person',
              ...person,
            },
          });
        });

        it('calls a resolver with the request and field details', () => {
          const spy = jest.fn(() => ({}));
          const schema = createInterfaceSchema();
          const {fillFragment} = createFillers(schema, {
            resolvers: {
              Person: spy,
            },
          });

          const fragment = createDocument(`
          fragment Details on Query {
              namedPerson: named {
                __typename
                ...on Person {
                  occupation
                }
              }
            }
          `);

          fillFragment(fragment, {namedPerson: {__typename: 'Person'}});

          expect(spy).toHaveBeenCalledWith(null, {
            type: schema.getType('Person'),
            parent: schema.getQueryType(),
            field: expect.objectContaining({
              fieldName: 'named',
              responseName: 'namedPerson',
            }),
            parentFields: [],
          });
        });

        it('throws an error when a provided typename is not an implementing type', () => {
          const {fillFragment} = createFillerForInterfaceSchema();
          const fragment = createDocument(`
          fragment Details on Query {
              named {
                __typename
              }
            }
          `);

          expect(() =>
            fillFragment(fragment, {named: {__typename: 'Mule'}}),
          ).toThrow(/No type found/);
        });
      });
    });

    describe('unions', () => {
      function createFillerForUnionSchema(options?: Options) {
        const {fillOperation, fillFragment} = createFillers(
          buildSchema(`
            type Person {
              name: String!
              occupation: String!
            }

            type Dog {
              name: String!
              legs: Int!
            }

            type Cat {
              name: String!
              livesLeft: Int!
            }

            union Named = Person | Dog | Cat

            type Query {
              named: Named!
            }
          `),
          options,
        );

        return {
          fillFragment,
          fillOperation(document: DocumentNode, data?: any) {
            return fillOperation(document, data)({query: document});
          },
        };
      }

      describe('fillOperation', () => {
        it('picks a random member type', () => {
          const {fillOperation} = createFillerForUnionSchema();
          const document = createDocument(`
            query Details {
              named {
                __typename
                ...on Person {
                  occupation
                }
                ...on Cat {
                  livesLeft
                }
              }
            }
          `);

          const possibleResults = [
            {
              named: {
                __typename: 'Person',
                occupation: expect.any(String),
              },
            },
            {
              named: {
                __typename: 'Cat',
                livesLeft: expect.any(Number),
              },
            },
            {
              named: {
                __typename: 'Dog',
              },
            },
          ];

          // The result of fillOperation is random based on a seed.
          // Its value should be one of items in the possibleResults array
          expect(possibleResults).toStrictEqual(
            expect.arrayContaining([fillOperation(document)]),
          );
        });

        it('picks a member type based on a static typename provided', () => {
          const {fillOperation} = createFillerForUnionSchema();
          const document = createDocument(`
            query Details {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillOperation(document, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks a member type based on a function-provided typename provided', () => {
          const {fillOperation} = createFillerForUnionSchema();
          const document = createDocument(`
            query Details {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillOperation(document, {named: {__typename: () => 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks a member type based on a function-provided object with typename provided', () => {
          const {fillOperation} = createFillerForUnionSchema();
          const document = createDocument(`
            query Details {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillOperation(document, {
              named: () => ({__typename: () => 'Person'}),
            }),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('uses a resolver value for the selected type', () => {
          const person = {occupation: 'Carpenter'};
          const {fillOperation} = createFillerForUnionSchema({
            resolvers: {
              Person: () => person,
            },
          });
          const document = createDocument(`
          query Details {
            named {
              __typename
              ...on Person {
                occupation
              }
            }
          }
        `);

          expect(
            fillOperation(document, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              __typename: 'Person',
              ...person,
            },
          });
        });

        it('throws an error when a provided typename is not an implementing type', () => {
          const {fillOperation} = createFillerForUnionSchema();
          const document = createDocument(`
            query Details {
              named {
                __typename
              }
            }
          `);

          expect(() =>
            fillOperation(document, {named: {__typename: 'Mule'}}),
          ).toThrow(/No type found/);
        });
      });

      describe('fillFragment', () => {
        it('picks a random member type', () => {
          const {fillFragment} = createFillerForUnionSchema();
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                __typename
                ...on Person {
                  occupation
                }
                ...on Cat {
                  livesLeft
                }
              }
            }
          `);

          const possibleResults = [
            {
              named: {
                __typename: 'Person',
                occupation: expect.any(String),
              },
            },
            {
              named: {
                __typename: 'Cat',
                livesLeft: expect.any(Number),
              },
            },
            {
              named: {
                __typename: 'Dog',
              },
            },
          ];

          // The result of fillFragment is random based on a seed.
          // Its value should be one of items in the possibleResults array
          expect(possibleResults).toStrictEqual(
            expect.arrayContaining([fillFragment(fragment)]),
          );
        });

        it('picks a member type based on a static typename provided', () => {
          const {fillFragment} = createFillerForUnionSchema();
          const fragment = createDocument(`
            fragment Details on Query{
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks a member type based on a function-provided typename provided', () => {
          const {fillFragment} = createFillerForUnionSchema();
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {named: {__typename: () => 'Person'}}),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('picks a member type based on a function-provided object with typename provided', () => {
          const {fillFragment} = createFillerForUnionSchema();
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {
              named: () => ({__typename: () => 'Person'}),
            }),
          ).toStrictEqual({
            named: {
              occupation: expect.any(String),
            },
          });
        });

        it('uses a resolver value for the selected type', () => {
          const person = {occupation: 'Carpenter'};
          const {fillFragment} = createFillerForUnionSchema({
            resolvers: {
              Person: () => person,
            },
          });
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                __typename
                ...on Person {
                  occupation
                }
              }
            }
          `);

          expect(
            fillFragment(fragment, {named: {__typename: 'Person'}}),
          ).toStrictEqual({
            named: {
              __typename: 'Person',
              ...person,
            },
          });
        });

        it('throws an error when a provided typename is not an implementing type', () => {
          const {fillFragment} = createFillerForUnionSchema();
          const fragment = createDocument(`
            fragment Details on Query {
              named {
                __typename
              }
            }
          `);

          expect(() =>
            fillFragment(fragment, {named: {__typename: 'Mule'}}),
          ).toThrow(/No type found/);
        });
      });
    });

    describe('resolvers', () => {
      describe('fillOperation', () => {
        it('uses a resolver for a primitive type', () => {
          const aString = 'Hello world';
          const {fillOperation} = createFillerForSchema(
            `
              type Query {
                name: String!
              }
            `,
            {
              resolvers: {
                String: () => aString,
              },
            },
          );

          const document = createDocument(`
            query Details {
              name
            }
          `);

          expect(fillOperation(document)).toStrictEqual({
            name: aString,
          });
        });

        it('uses a resolver for an object type', () => {
          const name = faker.person.firstName();
          const {fillOperation} = createFillerForSchema(
            `
              type Person {
                name: String!
              }

              type Query {
                self: Person!
              }
            `,
            {
              resolvers: {
                Person: () => ({
                  name,
                }),
              },
            },
          );

          const document = createDocument(`
            query Details {
              self { name }
            }
          `);

          expect(fillOperation(document)).toStrictEqual({
            self: {name},
          });
        });

        it('calls the resolver with the request and its type, parent object type, field, and parent field details', () => {
          const personResolver = jest.fn(() => ({
            name: faker.person.firstName(),
          }));
          const intResolver = jest.fn(() => 1);

          const schema = buildSchema(`
            type Person {
              name: String!
            }

            type Dog {
              id: ID!
              legs: Int!
            }

            type Query {
              pet: Dog!
              self: Person!
            }
          `);

          const {fillOperation} = createFillers(schema, {
            resolvers: {
              Int: intResolver,
              Person: personResolver,
            },
          });

          const document = createDocument(`
            query Details {
              pet { legs }
              me: self { name }
            }
          `);

          const request = {query: document};

          fillOperation(document)(request);

          expect(personResolver).toHaveBeenCalledWith(request, {
            type: schema.getType('Person'),
            field: expect.objectContaining({
              fieldName: 'self',
              responseName: 'me',
            }),
            parent: schema.getQueryType(),
            parentFields: [],
          });

          expect(intResolver).toHaveBeenCalledWith(request, {
            type: schema.getType('Int'),
            field: expect.objectContaining({
              fieldName: 'legs',
              responseName: 'legs',
            }),
            parent: schema.getType('Dog'),
            parentFields: [expect.objectContaining({fieldName: 'pet'})],
          });
        });

        it('uses partial values over resolver fields', () => {
          const name = faker.person.firstName();
          const {fillOperation} = createFillerForSchema(
            `
            type Person {
              age: Int!
              name: String!
            }

            type Query {
              self: Person!
            }
          `,
            {
              resolvers: {
                Person: () => ({
                  age: faker.number.int(),
                  name: faker.person.firstName(),
                }),
              },
            },
          );

          const document = createDocument(`
          query Details {
            self { age, name }
          }
        `);

          expect(fillOperation(document, {self: {name}})).toStrictEqual({
            self: {name, age: expect.any(Number)},
          });
        });

        it('uses falsy values over resolver fields', () => {
          const {fillOperation} = createFillerForSchema(
            `
              type Person {
                active: Boolean!
                name: String!
              }

              type Query {
                self: Person!
              }
            `,
            {
              resolvers: {
                Person: () => ({
                  active: true,
                  name: faker.person.firstName(),
                }),
              },
            },
          );

          const document = createDocument(`
            query Details {
              self { active, name }
            }
          `);

          expect(
            fillOperation(document, {self: {active: false}}),
          ).toStrictEqual({
            self: {name: expect.any(String), active: false},
          });
        });

        it('uses function values over resolver fields', () => {
          const {fillOperation} = createFillerForSchema(
            `
              type Person {
                active: Boolean!
                name: String!
              }

              type Query {
                self: Person!
              }
            `,
            {
              resolvers: {
                Person: () => ({
                  active: true,
                  name: faker.person.firstName(),
                }),
              },
            },
          );

          const document = createDocument(`
            query Details {
              self { active, name }
            }
          `);

          expect(
            fillOperation(document, {self: () => ({active: false})}),
          ).toStrictEqual({
            self: {name: expect.any(String), active: false},
          });
        });
      });

      describe('fillFragment', () => {
        it('uses a resolver for a primitive type', () => {
          const aString = 'Hello world';
          const {fillFragment} = createFillerForSchema(
            `
              type Query {
                name: String!
              }
            `,
            {
              resolvers: {
                String: () => aString,
              },
            },
          );

          const fragment = createDocument(`
            fragment Details on Query {
              name
            }
          `);

          expect(fillFragment(fragment)).toStrictEqual({
            name: aString,
          });
        });

        it('uses a resolver for an object type', () => {
          const name = faker.person.firstName();
          const {fillFragment} = createFillerForSchema(
            `
              type Person {
                name: String!
              }

              type Query {
                self: Person!
              }
            `,
            {
              resolvers: {
                Person: () => ({
                  name,
                }),
              },
            },
          );

          const fragment = createDocument(`
            fragment Details on Query {
              self { name }
            }
          `);

          expect(fillFragment(fragment)).toStrictEqual({
            self: {name},
          });
        });

        it('calls the resolver with the request and its type, parent object type, field, and parent field details', () => {
          const personResolver = jest.fn(() => ({
            name: faker.person.firstName(),
          }));
          const intResolver = jest.fn(() => 1);

          const schema = buildSchema(`
            type Person {
              name: String!
            }

            type Dog {
              id: ID!
              legs: Int!
            }

            type Query {
              pet: Dog!
              self: Person!
            }
          `);

          const {fillFragment} = createFillers(schema, {
            resolvers: {
              Int: intResolver,
              Person: personResolver,
            },
          });

          const fragment = createDocument(`
            fragment Details on Query {
              pet { legs }
              me: self { name }
            }
          `);

          fillFragment(fragment);

          expect(personResolver).toHaveBeenCalledWith(null, {
            type: schema.getType('Person'),
            field: expect.objectContaining({
              fieldName: 'self',
              responseName: 'me',
            }),
            parent: schema.getQueryType(),
            parentFields: [],
          });

          expect(intResolver).toHaveBeenCalledWith(null, {
            type: schema.getType('Int'),
            field: expect.objectContaining({
              fieldName: 'legs',
              responseName: 'legs',
            }),
            parent: schema.getType('Dog'),
            parentFields: [expect.objectContaining({fieldName: 'pet'})],
          });
        });

        it('uses partial values over resolver fields', () => {
          const name = faker.person.firstName();
          const {fillFragment} = createFillerForSchema(
            `
            type Person {
              age: Int!
              name: String!
            }

            type Query {
              self: Person!
            }
          `,
            {
              resolvers: {
                Person: () => ({
                  age: faker.number.int(),
                  name: faker.person.firstName(),
                }),
              },
            },
          );

          const fragment = createDocument(`
            fragment Details on Query{
              self { age, name }
            }
          `);

          expect(fillFragment(fragment, {self: {name}})).toStrictEqual({
            self: {name, age: expect.any(Number)},
          });
        });

        it('uses falsy values over resolver fields', () => {
          const {fillFragment} = createFillerForSchema(
            `
              type Person {
                active: Boolean!
                name: String!
              }

              type Query {
                self: Person!
              }
            `,
            {
              resolvers: {
                Person: () => ({
                  active: true,
                  name: faker.person.firstName(),
                }),
              },
            },
          );

          const fragment = createDocument(`
            fragment Details on Query {
              self { active, name }
            }
          `);

          expect(fillFragment(fragment, {self: {active: false}})).toStrictEqual(
            {
              self: {name: expect.any(String), active: false},
            },
          );
        });

        it('uses function values over resolver fields', () => {
          const {fillFragment} = createFillerForSchema(
            `
              type Person {
                active: Boolean!
                name: String!
              }

              type Query {
                self: Person!
              }
            `,
            {
              resolvers: {
                Person: () => ({
                  active: true,
                  name: faker.person.firstName(),
                }),
              },
            },
          );

          const fragment = createDocument(`
            fragment Details on Query {
              self { active, name }
            }
          `);

          expect(
            fillFragment(fragment, {self: () => ({active: false})}),
          ).toStrictEqual({
            self: {name: expect.any(String), active: false},
          });
        });
      });
    });
  });

  describe('lists', () => {
    describe('fillOperation', () => {
      it('fills a list as empty by default', () => {
        const {fillOperation} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const document = createDocument(`
          query Details {
            initials
          }
        `);

        expect(fillOperation(document)).toStrictEqual({initials: []});
      });

      it('fills a non-empty list', () => {
        const {fillOperation} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const document = createDocument<{initials: string[]}>(`
          query Details {
            initials
          }
        `);

        expect(fillOperation(document, {initials: list(3)})).toStrictEqual({
          initials: [
            expect.any(String),
            expect.any(String),
            expect.any(String),
          ],
        });
      });

      it('fills a list with a random size and respect the min range value', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0);
        const {fillOperation} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const document = createDocument<{initials: string[]}>(`
          query Details {
            initials
          }
        `);

        expect(fillOperation(document, {initials: list([1, 3])})).toStrictEqual(
          {
            initials: [expect.any(String)],
          },
        );
      });

      it('fills a list with a random size and respect the max range value', () => {
        jest.spyOn(Math, 'random').mockReturnValue(1);
        const {fillOperation} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const document = createDocument<{initials: string[]}>(`
          query Details {
            initials
          }
        `);

        expect(fillOperation(document, {initials: list([1, 3])})).toStrictEqual(
          {
            initials: [
              expect.any(String),
              expect.any(String),
              expect.any(String),
            ],
          },
        );
      });

      it('fills nested lists', () => {
        const {fillOperation} = createFillerForSchema(`
          type Query {
            initialList: [[String!]!]!
          }
        `);

        const document = createDocument<
          {
            initialList: string[][];
          },
          {initialList?: string[][] | null}
        >(`
          query Details {
            initialList
          }
        `);

        expect(
          fillOperation(document, {
            initialList: list(2, () => list<string>(2)),
          }),
        ).toStrictEqual({
          initialList: [
            [expect.any(String), expect.any(String)],
            [expect.any(String), expect.any(String)],
          ],
        });
      });

      it('fills objects nested in lists', () => {
        const {fillOperation} = createFillerForSchema(`
          type Person {
            name: String!
          }

          type Query {
            people: [Person!]!
          }
        `);

        const document = createDocument<
          {people: {name: string}[]},
          {people?: {name?: string | null}[] | null}
        >(`
          query Details {
            people {
              name
            }
          }
        `);

        expect(
          fillOperation(document, {
            people: [{}, {name: 'Chris'}],
          }),
        ).toStrictEqual({
          people: [{name: expect.any(String)}, {name: 'Chris'}],
        });
      });
    });

    describe('fillFragment', () => {
      it('fills a list as empty by default', () => {
        const {fillFragment} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const fragment = createDocument(`
          fragment Details on Query {
            initials
          }
        `);

        expect(fillFragment(fragment)).toStrictEqual({initials: []});
      });

      it('fills a non-empty list', () => {
        const {fillFragment} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const fragment = createDocument<{initials: string[]}>(`
          fragment Details on Query {
            initials
          }
        `);

        expect(fillFragment(fragment, {initials: list(3)})).toStrictEqual({
          initials: [
            expect.any(String),
            expect.any(String),
            expect.any(String),
          ],
        });
      });

      it('fills a list with a random size and respect the min range value', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0);
        const {fillFragment} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const fragment = createDocument<{initials: string[]}>(`
          fragment Details on Query {
            initials
          }
        `);

        expect(fillFragment(fragment, {initials: list([1, 3])})).toStrictEqual({
          initials: [expect.any(String)],
        });
      });

      it('fills a list with a random size and respect the max range value', () => {
        jest.spyOn(Math, 'random').mockReturnValue(1);
        const {fillFragment} = createFillerForSchema(`
          type Query {
            initials: [String!]!
          }
        `);

        const fragment = createDocument<{initials: string[]}>(`
          fragment Details on Query {
            initials
          }
        `);

        expect(fillFragment(fragment, {initials: list([1, 3])})).toStrictEqual({
          initials: [
            expect.any(String),
            expect.any(String),
            expect.any(String),
          ],
        });
      });

      it('fills nested lists', () => {
        const {fillFragment} = createFillerForSchema(`
          type Query {
            initialList: [[String!]!]!
          }
        `);

        const fragment = createDocument<
          {
            initialList: string[][];
          },
          {initialList?: string[][] | null}
        >(`
          fragment Details on Query {
            initialList
          }
        `);

        expect(
          fillFragment(fragment, {
            initialList: list(2, () => list<string>(2)),
          }),
        ).toStrictEqual({
          initialList: [
            [expect.any(String), expect.any(String)],
            [expect.any(String), expect.any(String)],
          ],
        });
      });

      it('fills objects nested in lists', () => {
        const {fillFragment} = createFillerForSchema(`
          type Person {
            name: String!
          }

          type Query {
            people: [Person!]!
          }
        `);

        const fragment = createDocument<
          {people: {name: string}[]},
          {people?: {name?: string | null}[] | null}
        >(`
          fragment Details on Query {
            people {
              name
            }
          }
        `);

        expect(
          fillFragment(fragment, {
            people: [{}, {name: 'Chris'}],
          }),
        ).toStrictEqual({
          people: [{name: expect.any(String)}, {name: 'Chris'}],
        });
      });
    });
  });
});

describe('faker', () => {
  it('re-exports faker for use by consumers', () => {
    expect(faker).toStrictEqual(originalFaker);
  });
});

function createFillerForSchema(schema: string, options?: Options) {
  const {fillOperation, fillFragment} = createFillers(
    buildSchema(schema),
    options,
  );
  return {
    fillFragment,
    fillOperation<Data extends {}, PartialData extends {}>(
      document: DocumentNode<Data, {}, PartialData>,
      data?: any,
    ) {
      return fillOperation<Data, {}, PartialData>(
        document,
        data,
      )({
        query: document,
      });
    },
  };
}

function createDocument<Data = {}, PartialData = {}>(source: string) {
  return parse<Data, never, PartialData>(source);
}
