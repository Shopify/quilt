import {buildSchema, parse, GraphQLSchema, Source, concatAST} from 'graphql';
import {compile} from 'graphql-tool-utilities/ast';

import {printFile, Options} from '../src/print';

describe('printFile()', () => {
  describe('primitive types', () => {
    it('prints a string type', () => {
      let schema = buildSchema(`
        type Query {
          name: String!
        }
      `);

      expect(print('query Name { name }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          name: String
        }
      `);

      expect(print('query Name { name }', schema)).toMatchSnapshot();
    });

    it('prints an integer type', () => {
      let schema = buildSchema(`
        type Query {
          age: Int!
        }
      `);

      expect(print('query Age { age }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          age: Int
        }
      `);

      expect(print('query Age { age }', schema)).toMatchSnapshot();
    });

    it('prints a float type', () => {
      let schema = buildSchema(`
        type Query {
          age: Float!
        }
      `);

      expect(print('query Age { age }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          age: Float
        }
      `);

      expect(print('query Age { age }', schema)).toMatchSnapshot();
    });

    it('prints a boolean type', () => {
      let schema = buildSchema(`
        type Query {
          married: Boolean!
        }
      `);

      expect(print('query Married { married }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          married: Boolean
        }
      `);

      expect(print('query Married { married }', schema)).toMatchSnapshot();
    });

    it('prints an ID type', () => {
      let schema = buildSchema(`
        type Query {
          id: ID!
        }
      `);

      expect(print('query ProductID { id }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          id: ID
        }
      `);

      expect(print('query ProductID { id }', schema)).toMatchSnapshot();
    });
  });

  describe('enum types', () => {
    it('prints the enum type and its type declaration', () => {
      let schema = buildSchema(`
        enum Episode {
          ONE
          TWO
          THREE
        }

        type Query {
          episode: Episode!
        }
      `);

      expect(print('query WhichEpisode { episode }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        enum Episode {
          ONE
          TWO
          THREE
        }

        type Query {
          episode: Episode
        }
      `);

      expect(print('query WhichEpisode { episode }', schema)).toMatchSnapshot();
    });
  });

  describe('custom scalars', () => {
    it('declares them as strings', () => {
      let schema = buildSchema(`
        scalar DateTime

        type Query {
          date: DateTime!
        }
      `);

      expect(print('query Date { date }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        scalar DateTime

        type Query {
          date: DateTime
        }
      `);

      expect(print('query Date { date }', schema)).toMatchSnapshot();
    });
  });

  describe('list types', () => {
    it('correctly wraps types that are potentially null', () => {
      let schema = buildSchema(`
        type Query {
          nicknames: [String!]!
        }
      `);

      expect(print('query Nicknames { nicknames }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          nicknames: [String]!
        }
      `);

      expect(print('query Nicknames { nicknames }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          nicknames: [String!]
        }
      `);

      expect(print('query Nicknames { nicknames }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          nicknames: [String]
        }
      `);

      expect(print('query Nicknames { nicknames }', schema)).toMatchSnapshot();
    });

    it('wraps nested lists', () => {
      let schema = buildSchema(`
        type Query {
          nicknames: [[String!]]!
        }
      `);

      expect(print('query Nicknames { nicknames }', schema)).toMatchSnapshot();

      schema = buildSchema(`
        type Query {
          nicknames: [[String]]
        }
      `);

      expect(print('query Nicknames { nicknames }', schema)).toMatchSnapshot();
    });
  });

  describe('object types', () => {
    const schema = buildSchema(`
      interface Entity {
        id: ID!
        name: String!
        nickname: String
      }

      enum Kind {
        DOG
        CAT
      }
    
      type Pet implements Entity {
        id: ID!
        name: String!
        nickname: String
        kind: Kind
      }

      type Person implements Entity {
        id: ID!
        name: String!
        nickname: String
        age: Int!
        relatives: [Person!]!
        favoritePet: Pet
      }

      type Query {
        person: Person
        entities: [Entity!]!
      }
    `);

    describe('objects fields', () => {
      it('nests them inline in the original object', () => {
        expect(print(`
          query Profile {
            person {
              name
              age
              relatives {
                name
                favoritePet {
                  name
                }
              }
            }
          }
        `, schema)).toMatchSnapshot();
      });
    });

    describe('inline fragments', () => {
      it('treats them as their original nullability when they are guaranteed', () => {
        expect(print(`
          query Entities {
            entities {
              ...on Entity {
                name
                nickname
              }
            }
          }
        `, schema)).toMatchSnapshot();
      });

      it('forces fields to be nullable when the type restriction is not guaranteed', () => {
        expect(print(`
          query Entities {
            entities {
              ...on Pet {
                name
                nickname
              }
            }
          }
        `, schema)).toMatchSnapshot();
      });
    });

    describe('fragment spreads', () => {
      it('prints them as union types when the type restriction is guaranteed', () => {
        expect(print(`
          query Entities {
            entities {
              ...EntityName
            }
          }
        `, schema, {
          'subfolder/MyFragment.graphql': `
            fragment EntityName on Entity {
              name
            }
          `
        })).toMatchSnapshot();
      });

      it('prints a partial fragment type when the type restriction is not guaranteed', () => {
        expect(print(`
          query Entities {
            entities {
              ...EntityName
            }
          }
        `, schema, {
          'subfolder/MyFragment.graphql': `
            fragment EntityName on Person {
              name
            }
          `
        })).toMatchSnapshot();
      });
    });
  });

  describe('variables', () => {
    it('prints out a variable interface and all associated types', () => {
      const schema = buildSchema(`
        scalar DateTime

        enum Style {
          FULL
          NICK
        }

        input Language {
          code: String
        }

        input NameInput {
          style: Style!
          date: DateTime
          excited: Boolean!
          language: Language
        }

        type Query {
          name(input: NameInput): String!
        }
      `);

      expect(print('query Name($myInput: NameInput) { name(input: $myInput) }', schema)).toMatchSnapshot();
    });
  });

  describe('mutations', () => {
    it('prints mutations', () => {
      const schema = buildSchema(`
        enum Kind {
          CAT
          DOG
        }

        type Pet {
          name: String!
          kind: Kind!
        }

        type Person {
          name: String!
          favoritePet: Pet
          pets: [Pet!]!
        }

        type Query {
          person: Person!
        }

        type Mutation {
          rename(name: String!): Person!
        }
      `);

      const document = `
        mutation Rename($name: String!) {
          rename(name: $name) {
            name
          }
        }
      `;

      expect(print(document, schema)).toMatchSnapshot();
    });
  });

  describe('fragments', () => {
    const schema = buildSchema(`
      interface Entity {
        id: ID!
        name: String!
        nickname: String
      }

      enum Kind {
        DOG
        CAT
      }
    
      type Pet implements Entity {
        id: ID!
        name: String!
        nickname: String
        kind: Kind
      }

      type Person implements Entity {
        id: ID!
        name: String!
        nickname: String
        age: Int!
        relatives: [Person!]!
        favoritePet: Pet
      }

      type Query {
        person: Person
        entities: [Entity!]!
      }
    `);

    it('prints fragment definitions', () => {
      const fragment = `
        fragment Pets on Entity {
          name
          nickname
        }
      `;

      expect(print(fragment, schema)).toMatchSnapshot();
    });

    it('prints fragment spreads', () => {
      const fragment = `
        fragment Pets on Entity {
          ...PetKind
          ...PersonDetails
          ...EntityName
          id
        }
      `;

      expect(print(fragment, schema, {
        'subfolder/PetKind.graphql': 'fragment PetKind on Pet { kind }',
        'subfolder/another/PersonDetails.graphql': `
          fragment PersonDetails on Person {
            id
            name
            nickname
            favoritePet { name }
          }

          fragment EntityName on Entity { name }
        `,
      })).toMatchSnapshot();
    });
    
    it('prints inline fragments', () => {
      const fragment = `
        fragment Pets on Entity {
          ...on Pet {
            id
            kind
          }
          ...on Person {
            name
            nickname
            favoritePet { name }
          }
        }
      `;

      expect(print(fragment, schema)).toMatchSnapshot();
    });
  });

  describe('multiple operations', () => {
    const schema = buildSchema(`
      enum Kind {
        CAT
        DOG
      }

      type Pet {
        name: String!
        kind: Kind!
      }

      type Person {
        name: String!
        favoritePet: Pet
        pets: [Pet!]!
      }

      type Query {
        person: Person!
      }
    `);

    const document = `
      query Person {
        person {
          ...FavoritePet
        }
      }

      query Pet {
        person {
          pets {
            ...PetDetails
          }
        }
      }

      fragment PetDetails on Pet {
        kind
      }

      fragment FavoritePet on Person {
        name
        favoritePet {
          ...PetDetails
        }
      }
    `;

    expect(print(document, schema)).toMatchSnapshot();
  });

  describe('__typename', () => {
    const schema = buildSchema(`
      interface Entity {
        id: ID!
        name: String!
        nickname: String
      }

      enum Kind {
        DOG
        CAT
      }
    
      type Pet implements Entity {
        id: ID!
        name: String!
        nickname: String
        kind: Kind
      }

      type Person implements Entity {
        id: ID!
        name: String!
        nickname: String
        age: Int!
        relatives: [Person!]!
        favoritePet: Pet
      }

      type Query {
        person: Person
        entities: [Entity!]!
      }
    `);

    it('does not duplicate an explicit __typename field', () => {
      expect(print(`
        query Profile {
          person {
            __typename
          }
        }
      `, schema)).toMatchSnapshot();
    });

    it('adds a __typename field when the responseName is unique', () => {
      expect(print(`
        query Profile {
          person {
            type: __typename
          }
        }
      `, schema)).toMatchSnapshot();
    });

    it('does not add a typename when the option is set to false', () => {
      expect(print(`
        query Profile {
          person {
            name
          }
        }
      `, schema, {}, {addTypename: false})).toMatchSnapshot();
    });

    it('adds an explicit typename when the option is set to false', () => {
      expect(print(`
        query Profile {
          person {
            __typename
          }
        }
      `, schema, {}, {addTypename: false})).toMatchSnapshot();
    });

    it('prints a correct typename for interfaces', () => {
      expect(print(`
        fragment MyEntity on Entity {
          name
        }
      `, schema)).toMatchSnapshot();
    });
  });
});

function print(
  documentString: string,
  schema: GraphQLSchema,
  fragments: {[key: string]: string} = {},
  options: Partial<Options> = {},
) {
  const finalOptions = {
    addTypename: true,
    ...options,
  }
  const fileName = 'MyOperation.graphql';
  const fragmentDocuments = Object.keys(fragments).map((key) => parse(new Source(fragments[key], key)));
  const document = parse(new Source(documentString, fileName));
  const ast = compile(schema, concatAST([document, ...fragmentDocuments]));
  const file = {
    path: fileName,
    operations: Object.keys(ast.operations).map((key) => ast.operations[key]).filter((operation) => operation.filePath === fileName),
    fragments: Object.keys(ast.fragments).map((key) => ast.fragments[key]).filter((fragment) => fragment.filePath === fileName),
  };
  return printFile(file, ast, finalOptions);
}
