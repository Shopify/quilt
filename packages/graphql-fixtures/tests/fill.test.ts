import faker from 'faker';
import {buildSchema} from 'graphql';
import {parse} from 'graphql-typed';

import {createFiller, list, Options} from '../src/fill';

jest.mock('../src/utilities', () => ({
  ...require.requireActual('../src/utilities'),
  chooseNull: jest.fn(() => false),
}));

const chooseNull: jest.Mock = require.requireMock('../src/utilities')
  .chooseNull;

describe('createFiller()', () => {
  beforeEach(() => {
    chooseNull.mockReset();
  });

  it('fills string fields', () => {
    const fill = createFillerForSchema(`
      type Query {
        name: String!
      }
    `);

    const document = createDocument(`
      query Details {
        name
      }
    `);

    expect(fill(document)).toEqual({
      name: expect.any(String),
    });
  });

  it('fills integer fields', () => {
    const fill = createFillerForSchema(`
      type Query {
        age: Int!
      }
    `);

    const document = createDocument<{age: number}>(`
      query Details {
        age
      }
    `);

    const {age} = fill(document);
    expect(age).toEqual(expect.any(Number));
    expect(Math.round(age)).toBe(age);
  });

  it('fills float fields', () => {
    const fill = createFillerForSchema(`
      type Query {
        age: Float!
      }
    `);

    const document = createDocument<{age: number}>(`
      query Details {
        age
      }
    `);

    const {age} = fill(document);
    expect(age).toEqual(expect.any(Number));
    expect(Math.round(age)).not.toBe(age);
  });

  it('fills boolean fields', () => {
    const fill = createFillerForSchema(`
      type Query {
        happy: Boolean!
      }
    `);

    const document = createDocument(`
      query Details {
        happy
      }
    `);

    expect(fill(document)).toEqual({
      happy: expect.any(Boolean),
    });
  });

  it('fills ID fields', () => {
    const fill = createFillerForSchema(`
      type Query {
        id: ID!
      }
    `);

    const document = createDocument(`
      query Details {
        id
      }
    `);

    expect(fill(document)).toEqual({
      id: expect.any(String),
    });
  });

  it('fills enum fields', () => {
    const fill = createFillerForSchema(`
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

    expect(fill(document)).toEqual({
      petPreference: expect.stringMatching(/^(DOG|CAT)$/),
    });
  });

  it('fills custom scalar fields', () => {
    const fill = createFillerForSchema(`
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

    expect(fill(document)).toEqual({
      birthday: expect.any(String),
    });
  });

  it('uses null sometimes for nullable fields', () => {
    chooseNull.mockReturnValue(true);

    const fill = createFillerForSchema(`
      type Query {
        name: String
      }
    `);

    const document = createDocument(`
      query Details {
        name
      }
    `);

    expect(fill(document)).toEqual({
      name: null,
    });
  });

  describe('randomness', () => {
    const fill = createFillerForSchema(`
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

      type Query {
        self: Person!
        sibling: Person
      }
    `);

    it('uses the same value for a given keypath', () => {
      const document = createDocument(`
        query Details {
          self { name, petPreference, birthday }
          sibling { name }
        }
      `);

      expect(fill(document)).toEqual(fill(document));
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

      expect(fill(selfDocument).self).not.toEqual(fill(meDocument).me);
    });

    it('uses different values for a list of keypaths', () => {
      const document = createDocument<{
        self: {parents: {name: string}[]};
      }>(`
      query Details {
        self { parents { name } }
      }
      `);

      const data = fill(document, {self: {parents: () => [{}, {}]}});

      expect(data.self.parents[0].name).not.toEqual(data.self.parents[1].name);
    });
  });

  describe('objects', () => {
    it('fills nested objects', () => {
      const fill = createFillerForSchema(`
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

      expect(fill(document)).toEqual({
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

      const fill = createFillerForSchema(`
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

      expect(fill(document, {name})).toEqual({
        age: expect.any(Number),
        name,
      });
    });

    it('uses a function partial value', () => {
      const name = 'Chris';

      const fill = createFillerForSchema(`
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

      expect(fill(document, {name: () => name})).toEqual({
        age: expect.any(Number),
        name,
      });
    });

    it('uses a partial value for nested fields', () => {
      const motherName = faker.name.firstName();
      const fill = createFillerForSchema(`
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

      expect(fill(document, {self: {mother: {name: motherName}}})).toEqual({
        self: {
          name: expect.any(String),
          mother: {
            name: motherName,
          },
        },
      });
    });

    it('uses a function partial value for nested fields', () => {
      const motherName = faker.name.firstName();
      const fill = createFillerForSchema(`
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
        fill(document, {
          self: () => ({
            mother: {name: () => motherName},
          }),
        }),
      ).toEqual({
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
      const fill = createFillerForSchema(`
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
        fill(document, {
          self: {
            sister: {},
          },
        }),
      ).toEqual({
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

      const fill = createFillerForSchema(`
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

      expect(fill(document, {self: {sister: null}})).toEqual({
        self: {sister: null},
      });
    });

    it('always uses null when explicitly set in a resolver', () => {
      chooseNull.mockReturnValue(false);

      const fill = createFillerForSchema(
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

      expect(fill(document, {self: {sister: null}})).toEqual({
        self: {sister: null},
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

      it('fills with the actual typename of a parent object field', () => {
        const fill = createFillerForBasicObjectSchema();

        const document = createDocument(`
          query Details {
            __typename
            self {
              __typename
              type: __typename
            }
          }
        `);

        expect(fill(document)).toEqual({
          __typename: 'Query',
          self: {
            __typename: 'Person',
            type: 'Person',
          },
        });
      });

      it('does not add a typename when the option is falsy', () => {
        const fill = createFillerForBasicObjectSchema();

        const document = createDocument(`
          query Details {
            self {
              name
            }
          }
        `);

        expect(fill(document)).not.toHaveProperty('self.__typename');
      });

      it('adds an explicit typename when the option is truthy', () => {
        const fill = createFillerForBasicObjectSchema({addTypename: true});

        const document = createDocument(`
          query Details {
            self {
              name
            }
          }
        `);

        expect(fill(document)).toHaveProperty('self.__typename', 'Person');
      });

      it('adds an explicit typename field when it is requested with a different responseName', () => {
        const fill = createFillerForBasicObjectSchema({addTypename: true});

        const document = createDocument(`
          query Details {
            self {
              type: __typename
            }
          }
        `);

        expect(fill(document)).toHaveProperty('self.__typename', 'Person');
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
        return createFiller(createInterfaceSchema(), options);
      }

      it('picks a random implementing type', () => {
        const fill = createFillerForInterfaceSchema();
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

        expect(fill(document)).toBeOneOf([
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
        ]);
      });

      it('always picks the same implementing type', () => {
        const fill = createFillerForInterfaceSchema();
        const document = createDocument(`
          query Details {
            named {
              __typename
            }
          }
        `);

        expect(fill(document)).toEqual(fill(document));
      });

      it('picks an implementing type based on a static typename provided', () => {
        const fill = createFillerForInterfaceSchema();
        const document = createDocument(`
          query Details {
            named {
              ...on Person {
                occupation
              }
            }
          }
        `);

        expect(fill(document, {named: {__typename: 'Person'}})).toEqual({
          named: {
            occupation: expect.any(String),
          },
        });
      });

      it('picks an implementing type based on a function-provided typename provided', () => {
        const fill = createFillerForInterfaceSchema();
        const document = createDocument(`
          query Details {
            named {
              ...on Person {
                occupation
              }
            }
          }
        `);

        expect(fill(document, {named: {__typename: () => 'Person'}})).toEqual({
          named: {
            occupation: expect.any(String),
          },
        });
      });

      it('picks an implementing type based on a function-provided object with typename provided', () => {
        const fill = createFillerForInterfaceSchema();
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
          fill(document, {named: () => ({__typename: () => 'Person'})}),
        ).toEqual({
          named: {
            occupation: expect.any(String),
          },
        });
      });

      it('uses a resolver value for the selected type', () => {
        const person = {occupation: 'Carpenter'};
        const fill = createFillerForInterfaceSchema({
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

        expect(fill(document, {named: {__typename: 'Person'}})).toEqual({
          named: {
            __typename: 'Person',
            ...person,
          },
        });
      });

      it('calls a resolver with the field details', () => {
        const spy = jest.fn(() => ({}));
        const schema = createInterfaceSchema();
        const fill = createFiller(schema, {
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

        fill(document, {namedPerson: {__typename: 'Person'}});
        expect(spy).toHaveBeenCalledWith({
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
        const fill = createFillerForInterfaceSchema();
        const document = createDocument(`
          query Details {
            named {
              __typename
            }
          }
        `);

        expect(() =>
          fill(document, {named: {__typename: 'Mule'}}),
        ).toThrowError();
      });
    });

    describe('unions', () => {
      function createFillerForUnionSchema(options?: Options) {
        return createFiller(
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
      }

      it('picks a random member type', () => {
        const fill = createFillerForUnionSchema();
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

        expect(fill(document)).toBeOneOf([
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
        ]);
      });

      it('picks a member type based on a static typename provided', () => {
        const fill = createFillerForUnionSchema();
        const document = createDocument(`
          query Details {
            named {
              ...on Person {
                occupation
              }
            }
          }
        `);

        expect(fill(document, {named: {__typename: 'Person'}})).toEqual({
          named: {
            occupation: expect.any(String),
          },
        });
      });

      it('picks a member type based on a function-provided typename provided', () => {
        const fill = createFillerForUnionSchema();
        const document = createDocument(`
          query Details {
            named {
              ...on Person {
                occupation
              }
            }
          }
        `);

        expect(fill(document, {named: {__typename: () => 'Person'}})).toEqual({
          named: {
            occupation: expect.any(String),
          },
        });
      });

      it('picks a member type based on a function-provided object with typename provided', () => {
        const fill = createFillerForUnionSchema();
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
          fill(document, {named: () => ({__typename: () => 'Person'})}),
        ).toEqual({
          named: {
            occupation: expect.any(String),
          },
        });
      });

      it('uses a resolver value for the selected type', () => {
        const person = {occupation: 'Carpenter'};
        const fill = createFillerForUnionSchema({
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

        expect(fill(document, {named: {__typename: 'Person'}})).toEqual({
          named: {
            __typename: 'Person',
            ...person,
          },
        });
      });

      it('throws an error when a provided typename is not an implementing type', () => {
        const fill = createFillerForUnionSchema();
        const document = createDocument(`
          query Details {
            named {
              __typename
            }
          }
        `);

        expect(() =>
          fill(document, {named: {__typename: 'Mule'}}),
        ).toThrowError();
      });
    });

    describe('resolvers', () => {
      it('uses a resolver for a primitive type', () => {
        const aString = 'Hello world';
        const fill = createFillerForSchema(
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

        expect(fill(document)).toEqual({
          name: aString,
        });
      });

      it('uses a resolver for an object type', () => {
        const name = faker.name.firstName();
        const fill = createFillerForSchema(
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

        expect(fill(document)).toEqual({
          self: {name},
        });
      });

      it('calls the resolver with its type, parent object type, field, and parent field details', () => {
        const personResolver = jest.fn(() => ({name: faker.name.firstName()}));
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

        const fill = createFiller(schema, {
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

        fill(document);

        expect(personResolver).toHaveBeenCalledWith({
          type: schema.getType('Person'),
          field: expect.objectContaining({
            fieldName: 'self',
            responseName: 'me',
          }),
          parent: schema.getQueryType(),
          parentFields: [],
        });

        expect(intResolver).toHaveBeenCalledWith({
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
        const name = faker.name.firstName();
        const fill = createFillerForSchema(
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
                age: faker.random.number({precision: 1}),
                name: faker.name.firstName(),
              }),
            },
          },
        );

        const document = createDocument(`
          query Details {
            self { age, name }
          }
        `);

        expect(fill(document, {self: {name}})).toEqual({
          self: {name, age: expect.any(Number)},
        });
      });

      it('uses falsy values over resolver fields', () => {
        const fill = createFillerForSchema(
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
                name: faker.name.firstName(),
              }),
            },
          },
        );

        const document = createDocument(`
          query Details {
            self { active, name }
          }
        `);

        expect(fill(document, {self: {active: false}})).toEqual({
          self: {name: expect.any(String), active: false},
        });
      });

      it('uses function values over resolver fields', () => {
        const fill = createFillerForSchema(
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
                name: faker.name.firstName(),
              }),
            },
          },
        );

        const document = createDocument(`
          query Details {
            self { active, name }
          }
        `);

        expect(fill(document, {self: () => ({active: false})})).toEqual({
          self: {name: expect.any(String), active: false},
        });
      });
    });
  });

  describe('lists', () => {
    it('fills a list as empty by default', () => {
      const fill = createFillerForSchema(`
        type Query {
          initials: [String!]!
        }
      `);

      const document = createDocument(`
        query Details {
          initials
        }
      `);

      expect(fill(document)).toEqual({initials: []});
    });

    it('fills a non-empty list', () => {
      const fill = createFillerForSchema(`
        type Query {
          initials: [String!]!
        }
      `);

      const document = createDocument<{initials: string[]}>(`
        query Details {
          initials
        }
      `);

      expect(fill(document, {initials: list(3)})).toEqual({
        initials: [expect.any(String), expect.any(String), expect.any(String)],
      });
    });

    it('fills nested lists', () => {
      const fill = createFillerForSchema(`
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
        fill(document, {
          initialList: list(2, () => list<string>(2)),
        }),
      ).toEqual({
        initialList: [
          [expect.any(String), expect.any(String)],
          [expect.any(String), expect.any(String)],
        ],
      });
    });

    it('fills objects nested in lists', () => {
      const fill = createFillerForSchema(`
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
        fill(document, {
          people: [{}, {name: 'Chris'}],
        }),
      ).toEqual({
        people: [{name: expect.any(String)}, {name: 'Chris'}],
      });
    });
  });
});

function createFillerForSchema(schema: string, options?: Options) {
  return createFiller(buildSchema(schema), options);
}

function createDocument<Data = {}, PartialData = {}>(source: string) {
  return parse<Data, never, PartialData>(source);
}
