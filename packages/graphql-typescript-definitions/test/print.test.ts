import {buildSchema, parse, GraphQLSchema, Source, concatAST} from 'graphql';
import {compile} from 'graphql-tool-utilities/ast';

import {printFile} from '../src/print';

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

    describe('union types', () => {});
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
});

function print(
  documentString: string,
  schema: GraphQLSchema,
  fragments: {[key: string]: string} = {},
) {
  const fileName = 'MyQuery.graphql';
  const fragmentDocuments = Object.keys(fragments).map((key) => parse(new Source(fragments[key], key)));
  const document = parse(new Source(documentString, fileName));
  const ast = compile(schema, concatAST([document, ...fragmentDocuments]));
  const file = {
    path: fileName,
    operation: Object.keys(ast.operations).map((key) => ast.operations[key]).find((operation) => operation.filePath === fileName),
    fragment: Object.keys(ast.fragments).map((key) => ast.fragments[key]).find((fragment) => fragment.filePath === fileName),
  };
  return printFile(file, ast);
}
