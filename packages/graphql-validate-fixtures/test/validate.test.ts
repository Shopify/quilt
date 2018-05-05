import {join} from 'path';
import {GraphQLSchema, buildSchema, parse, concatAST} from 'graphql';
import {compile, AST} from 'graphql-tool-utilities/ast';
import {
  validateFixtureAgainstAST,
  validateFixtureAgainstSchema,
} from '../src/validate';

describe('validate', () => {
  describe('validateFixtureAgainstAST()', () => {
    it('validates strings', () => {
      let ast = createAST(
        `
        type Query { name: String! }
      `,
        'query NameQuery { name }',
      );

      expect(validateAgainstAST({name: 42}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({name: null}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({name: 'Chris'}, ast)).toMatchSnapshot();

      ast = createAST(
        `
        type Query { address: String }
      `,
        'query AddressQuery { address }',
      );

      expect(validateAgainstAST({address: 42}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({address: null}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({address: 'Chris'}, ast)).toMatchSnapshot();
    });

    it('validates numbers', () => {
      let ast = createAST(
        `
        type Query { age: Int! }
      `,
        'query AgeQuery { age }',
      );

      expect(validateAgainstAST({age: '42'}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({age: null}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({age: 42}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({age: 42.5}, ast)).toMatchSnapshot();

      ast = createAST(
        `
        type Query { height: Float }
      `,
        'query HeightQuery { height }',
      );

      expect(validateAgainstAST({height: '42.3'}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({height: null}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({height: 42.3}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({height: 42}, ast)).toMatchSnapshot();
    });

    it('validates booleans', () => {
      let ast = createAST(
        `
        type Query { married: Boolean! }
      `,
        'query MarriedQuery { married }',
      );

      expect(validateAgainstAST({married: 'true'}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({married: null}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({married: true}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({married: false}, ast)).toMatchSnapshot();

      ast = createAST(
        `
        type Query { responded: Boolean }
      `,
        'query RespondedQuery { responded }',
      );

      expect(validateAgainstAST({responded: 'true'}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({responded: null}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({responded: true}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({responded: false}, ast)).toMatchSnapshot();
    });

    it('validates enums', () => {
      let ast = createAST(
        `
        enum Generation {
          FIRST
          SECOND
          THIRD
        }
        type Query { generation: Generation! }
      `,
        'query GenerationQuery { generation }',
      );

      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({generation: null}, ast)).toMatchSnapshot();
      expect(
        validateAgainstAST({generation: 'SEVENTH'}, ast),
      ).toMatchSnapshot();
      expect(validateAgainstAST({generation: true}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({generation: 'SECOND'}, ast)).toMatchSnapshot();

      ast = createAST(
        `
        enum Generation { FIRST, SECOND, THIRD }
        type Query { generation: Generation }
      `,
        'query GenerationQuery { generation }',
      );

      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({generation: null}, ast)).toMatchSnapshot();
      expect(
        validateAgainstAST({generation: 'SEVENTH'}, ast),
      ).toMatchSnapshot();
      expect(validateAgainstAST({generation: true}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({generation: 'SECOND'}, ast)).toMatchSnapshot();
    });

    describe('lists', () => {
      it('validates the types of lists', () => {
        const ast = createAST(
          `
          type Query { favoriteNumbers: [Int!]! }
        `,
          'query FavoriteNumbersQuery { favoriteNumbers }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({favoriteNumbers: null}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({favoriteNumbers: []}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({favoriteNumbers: {}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({favoriteNumbers: [1, 2.5, null, true, 5]}, ast),
        ).toMatchSnapshot();
      });

      it('validates nested arrays', () => {
        const ast = createAST(
          `
          type Query { sets: [[Int!]!] }
        `,
          'query SetsQuery { sets }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({sets: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({sets: []}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({sets: [1, 2, 3]}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({sets: [[1, 2, null], [true, {}, 3]]}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({sets: [null, [1, 2], true]}, ast),
        ).toMatchSnapshot();
      });

      it('validates objects nested in arrays', () => {
        const ast = createAST(
          `
          type Person {
            name: String!
            age: Int!
          }
          type Query { people: [Person!]! }
        `,
          'query PeopleQuery { people { name } }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({people: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({people: []}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({people: [1]}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({people: [{}]}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({people: [{name: true}]}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({people: [{name: 'Chris'}]}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({people: [{name: 'Chris', age: 42}]}, ast),
        ).toMatchSnapshot();
      });
    });

    describe('objects', () => {
      it('validates that the value is actually an object', () => {
        const ast = createAST(
          `
          type Person { name: String! }
          type Query { person: Person! }
        `,
          'query PersonQuery { person { name } }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: {}}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: true}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: 'Chris'}}, ast),
        ).toMatchSnapshot();
      });

      it('creates errors for keys not present in the query', () => {
        const ast = createAST(
          `
          type Person {
            name: String!
            age: Int
          }
          type Query { person: Person! }
        `,
          'query PersonQuery { person { name } }',
        );

        expect(
          validateAgainstAST({person: {name: 'Chris', age: 42}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: 'Chris', foo: true}}, ast),
        ).toMatchSnapshot();
      });

      it('validates nested objects', () => {
        const ast = createAST(
          `
          type Address { number: Int }
          type Person { address: Address! }
          type Query { person: Person! }
        `,
          'query AddressQuery { person { address { number } } }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: {}}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: null}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {number: '63'}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {number: 15.4}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {number: 63}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {street: 'Main st'}}}, ast),
        ).toMatchSnapshot();
      });

      it('validates nested nullable objects', () => {
        const ast = createAST(
          `
          type Address { number: Int }
          type Person { address: Address }
          type Query { person: Person! }
        `,
          'query AddressQuery { person { address { number } } }',
        );

        expect(
          validateAgainstAST({person: {address: null}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {number: '63'}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {number: 15.4}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {number: 63}}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {address: {street: 'Main st'}}}, ast),
        ).toMatchSnapshot();
      });

      it('validates aliases', () => {
        let ast = createAST(
          `
          type Person { name: String! }
          type Query { person: Person! }
        `,
          'query PersonQuery { person { nom: name } }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: {}}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {nom: true}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {nom: 'Chris'}}, ast),
        ).toMatchSnapshot();

        ast = createAST(
          `
          type Person { name: String! }
          type Query { person: Person! }
        `,
          'query PersonQuery { chris: person { nom: name } }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({chris: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({chris: {}}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({chris: {nom: true}}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({chris: {nom: 'Chris'}}, ast),
        ).toMatchSnapshot();
      });
    });

    describe('fragments', () => {
      it('includes fields from inline fragments', () => {
        const ast = createAST(
          `
          type Person { name: String! }
          type Query { person: Person! }
        `,
          'query PersonQuery { person { ... on Person { name } } }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: {}}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: true}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: 'Chris'}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: 'Chris', age: 42}}, ast),
        ).toMatchSnapshot();
      });

      it('includes fields from separate fragments', () => {
        const ast = createAST(
          `
          type Person { name: String! }
          type Query { person: Person! }
        `,
          'query PersonQuery { person { ...PersonFragment } }',
          'fragment PersonFragment on Person { name }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({person: {}}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: true}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: 'Chris'}}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({person: {name: 'Chris', age: 42}}, ast),
        ).toMatchSnapshot();
      });

      it('treats fields on interface type spreads to be nullable', () => {
        const ast = createAST(
          `
          interface Animal { name: String! }
          type Cat implements Animal {
            name: String!
            purrs: Boolean!
          }
          type Dog implements Animal {
            name: String!
            barks: Boolean!
          }
          type Query { animals: [Animal!]! }
        `,
          'query DogQuery { animals { name, ...DogFragment } }',
          'fragment DogFragment on Dog { barks }',
        );

        expect(validateAgainstAST({}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({animals: null}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({animals: []}, ast)).toMatchSnapshot();
        expect(validateAgainstAST({animals: [{}]}, ast)).toMatchSnapshot();
        expect(
          validateAgainstAST({animals: [{name: 'Winston'}]}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({animals: [{name: 'Winston', barks: 40}]}, ast),
        ).toMatchSnapshot();
        expect(
          validateAgainstAST({animals: [{name: 'Winston', barks: true}]}, ast),
        ).toMatchSnapshot();
      });
    });

    it('works with multiple top-level items', () => {
      const ast = createAST(
        `
        type Query {
          name: String!
          age: Int
        }
      `,
        'query MyQuery { name, age }',
      );

      expect(validateAgainstAST({name: 42}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({name: null}, ast)).toMatchSnapshot();
      expect(
        validateAgainstAST({name: null, age: 42.5}, ast),
      ).toMatchSnapshot();
      expect(validateAgainstAST({name: 'Chris'}, ast)).toMatchSnapshot();
      expect(
        validateAgainstAST({name: 'Chris', age: null}, ast),
      ).toMatchSnapshot();
      expect(
        validateAgainstAST({name: 'Chris', age: 42}, ast),
      ).toMatchSnapshot();
      expect(
        validateAgainstAST({name: 'Chris', age: 42.5}, ast),
      ).toMatchSnapshot();
      expect(
        validateAgainstAST({name: 'Chris', age: '42'}, ast),
      ).toMatchSnapshot();
    });

    it('validates mutations', () => {
      const ast = createAST(
        `
        type Person {
          hadFunBirthday: Boolean
        }
        type Mutation {
          haveBirthday(wasFun: Boolean!): Person!
        }
        type Query {
          person: Person
        }
      `,
        `
        mutation MyMutation {
          haveBirthday(fun: true) {
            hadFunBirthday
          }
        }
      `,
      );

      expect(validateAgainstAST({}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({haveBirthday: true}, ast)).toMatchSnapshot();
      expect(validateAgainstAST({haveBirthday: {}}, ast)).toMatchSnapshot();
      expect(
        validateAgainstAST({haveBirthday: {hadFunBirthday: null}}, ast),
      ).toMatchSnapshot();
      expect(
        validateAgainstAST({haveBirthday: {hadFunBirthday: 'true'}}, ast),
      ).toMatchSnapshot();
      expect(
        validateAgainstAST({haveBirthday: {hadFunBirthday: true}}, ast),
      ).toMatchSnapshot();
      expect(
        validateAgainstAST({haveBirthday: {hadFunBirthday: false}}, ast),
      ).toMatchSnapshot();
    });
  });

  describe('validateFixtureAgainstSchema()', () => {
    it('validates fields against types from the schema', () => {
      const schema = buildSchema(`
        type Person {
          name: String!
          age: Int!
          occupation: String
          nickNames: [String!]
        }

        type Query {
          friends: [Person!]!
          person: Person!
        }

        type Mutation {
          landJob(job: String!): Person!
        }
      `);

      expect(
        validateAgainstSchema(
          {
            person: {
              name: 'Chris',
              age: 42.2,
              silly: true,
              nickNames: {},
            },
            friends: [{firstName: 'Mica'}, {name: null}],
            landJob: {
              occupation: 'Code monkey',
            },
          },
          schema,
        ),
      ).toMatchSnapshot();
    });
  });
});

function validateAgainstAST(fixture: any, ast: AST) {
  const queryName = Object.keys(ast.operations)[0];
  return validateFixtureAgainstAST(
    {
      path: join(queryName, 'fixture.json'),
      content: fixture,
    },
    ast,
  );
}

function validateAgainstSchema(fixture: any, schema: GraphQLSchema) {
  return validateFixtureAgainstSchema(
    {
      path: 'fixture.json',
      content: fixture,
    },
    schema,
  );
}

function createAST(schemaString: string, ...queryStrings: string[]) {
  const schema = buildSchema(schemaString);
  const ast = concatAST(queryStrings.map((queryString) => parse(queryString)));
  return compile(schema, ast);
}
