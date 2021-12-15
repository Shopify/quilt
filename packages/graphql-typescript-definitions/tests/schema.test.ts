// eslint-disable-next-line @shopify/typescript/prefer-build-client-schema
import {buildSchema} from 'graphql';
import {stripIndent} from 'common-tags';

import {generateSchemaTypes} from '../src/print/schema';
import {EnumFormat} from '../src/types';

describe('printSchema()', () => {
  describe('enum', () => {
    const schema = buildSchema(`
      enum Episode {
        NEW_HOPE
        EMPIRE
        JEDI
        FORCE_AWAKENS
        LAST_JEDI
      }

      type Query {
        episode: Episode
      }
    `);

    it('prints an enum file with cases matching value names', () => {
      expect(generateSchemaTypes(schema).get('Episode.ts'))
        .toContain(stripIndent`
        export enum Episode {
          NEW_HOPE = "NEW_HOPE",
          EMPIRE = "EMPIRE",
          JEDI = "JEDI",
          FORCE_AWAKENS = "FORCE_AWAKENS",
          LAST_JEDI = "LAST_JEDI",
        }
      `);
    });

    it('prints an enum file with screaming snake case names', () => {
      expect(
        generateSchemaTypes(schema, {
          enumFormat: EnumFormat.ScreamingSnakeCase,
        }).get('Episode.ts'),
      ).toContain(stripIndent`
        export enum Episode {
          NEW_HOPE = "NEW_HOPE",
          EMPIRE = "EMPIRE",
          JEDI = "JEDI",
          FORCE_AWAKENS = "FORCE_AWAKENS",
          LAST_JEDI = "LAST_JEDI",
        }
      `);
    });

    it('prints an enum file with snake case names', () => {
      expect(
        generateSchemaTypes(schema, {enumFormat: EnumFormat.SnakeCase}).get(
          'Episode.ts',
        ),
      ).toContain(stripIndent`
        export enum Episode {
          new_hope = "NEW_HOPE",
          empire = "EMPIRE",
          jedi = "JEDI",
          force_awakens = "FORCE_AWAKENS",
          last_jedi = "LAST_JEDI",
        }
      `);
    });

    it('prints an enum file with camelcase names', () => {
      expect(
        generateSchemaTypes(schema, {enumFormat: EnumFormat.CamelCase}).get(
          'Episode.ts',
        ),
      ).toContain(stripIndent`
        export enum Episode {
          newHope = "NEW_HOPE",
          empire = "EMPIRE",
          jedi = "JEDI",
          forceAwakens = "FORCE_AWAKENS",
          lastJedi = "LAST_JEDI",
        }
      `);
    });

    it('prints an enum file with pascal case names', () => {
      expect(
        generateSchemaTypes(schema, {enumFormat: EnumFormat.PascalCase}).get(
          'Episode.ts',
        ),
      ).toContain(stripIndent`
        export enum Episode {
          NewHope = "NEW_HOPE",
          Empire = "EMPIRE",
          Jedi = "JEDI",
          ForceAwakens = "FORCE_AWAKENS",
          LastJedi = "LAST_JEDI",
        }
      `);
    });

    it('generates files per enum', () => {
      const schema = buildSchema(`
        enum Gandalf {
          WHITE
          GREY
        }

        enum Permissions {
          SHALL_PASS
          SHALL_NOT_PASS
        }

        type Query {
          getWizard(permissions: Permissions): Gandalf!
        }
      `);
      expect(generateSchemaTypes(schema).has('Gandalf.ts')).toBe(true);
      expect(generateSchemaTypes(schema).has('Permissions.ts')).toBe(true);
    });
  });

  it('prints a unambiguous es module file if nothing would otherwise be exported', () => {
    const schema = buildSchema('type Query');
    expect(generateSchemaTypes(schema).get('index.ts')).toStrictEqual(
      'export {};',
    );
  });

  describe('custom scalar', () => {
    it('prints in the index file', () => {
      const schema = buildSchema(`
        scalar Date

        type Query {
          getDate: Date
        }
      `);
      expect(generateSchemaTypes(schema).get('index.ts')).toContain(
        'export type Date = string;',
      );
    });

    it('does not print built-in scalar in the index file', () => {
      const schema = buildSchema(`
      scalar Date

      type Query {
        getDate: Date
      }
    `);
      expect(generateSchemaTypes(schema).get('index.ts')).not.toContain(
        'export type String',
      );
    });

    it('prints with a specified import type in the index file', () => {
      const schema = buildSchema(`
        scalar HtmlSafeString

        type Query {
          getHtml: HtmlSafeString
        }
      `);

      const content = generateSchemaTypes(schema, {
        customScalars: {
          HtmlSafeString: {
            name: 'SafeString',
            package: 'my-types-package',
          },
        },
      }).get('index.ts');

      expect(content).toContain(stripIndent`
        export type HtmlSafeString = __HtmlSafeString__SafeString;
      `);

      expect(content).toContain(stripIndent`
        import { SafeString as __HtmlSafeString__SafeString } from "my-types-package";
      `);
    });

    it('uses import as unique/safe name when one custom type is defined for multiple scalar types', () => {
      const schema = buildSchema(`
        scalar HtmlSafeString
        scalar FormattedString

        type Query {
          getHtml: HtmlSafeString
          formatHtml(html: HtmlSafeString): FormattedString
        }
      `);

      const content = generateSchemaTypes(schema, {
        customScalars: {
          HtmlSafeString: {
            name: 'SafeString',
            package: 'my-types-package',
          },
          FormattedString: {
            name: 'SafeString',
            package: 'my-types-package',
          },
        },
      }).get('index.ts');

      expect(content).toContain(stripIndent`
        import { SafeString as __HtmlSafeString__SafeString } from "my-types-package";
      `);

      expect(content).toContain(stripIndent`
        import { SafeString as __FormattedString__SafeString } from "my-types-package";
      `);
    });

    it('prints native type', () => {
      const schema = buildSchema(`
        scalar Seconds

        type Query {
          getTime: Seconds
        }
      `);

      const content = generateSchemaTypes(schema, {
        customScalars: {
          Seconds: {
            name: 'number',
          },
        },
      }).get('index.ts');

      expect(content).toContain(stripIndent`
        export type Seconds = number;
      `);

      expect(content).not.toContain('import { number ');
    });
  });

  describe('union', () => {
    it('prints with primitive member types in index file', () => {
      const schema = buildSchema(`
        union Price = Int | String

        type Query {
          price: Price!
        }
    `);
      expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
        export type Price = number | string;
      `);
    });

    it('prints with custom scalar member type in index file', () => {
      const schema = buildSchema(`
        scalar Seconds
        union Minutes = Int

        union Time = Minutes | Seconds

        type Query {
          length: Time!
        }
    `);

      expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
        export type Minutes = number;
        export type Seconds = string;
        export type Time = Minutes | Seconds;
      `);
    });

    it('prints with nested union members', () => {
      const schema = buildSchema(`
          type Hardback {
            name: String!
          }

          type Paperback {
            name: String!
          }

          union Book = Hardback | Paperback

          type Movie {
            name: String!
          }

          union Media = Book | Movie

          type Query {
            media: Media!
          }
    `);

      expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
          export interface Hardback {
            __typename: "Hardback";
            name: string;
          }
          export interface Paperback {
            __typename: "Paperback";
            name: string;
          }
          export type Book = Hardback | Paperback;
          export interface Movie {
            __typename: "Movie";
            name: string;
          }
          export type Media = Book | Movie;
        `);
    });
  });

  it('prints an input object in the index file', () => {
    const schema = buildSchema(`
      input Input {
        name: String!
      }

      type Query {
        output(input: Input): Boolean
      }
    `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      export interface Input {
        name: string;
      }
    `);
  });

  it('prints an object type in the index file', () => {
    const schema = buildSchema(`
    type Product {
      name: String!
    }

    type Query {
      product: Product!
    }
  `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      export interface Product {
        __typename: "Product";
        name: string;
      }
    `);
  });

  it('prints private interface type in the index file', () => {
    const schema = buildSchema(`
    interface Book {
      title: String!
    }

    type Textbook implements Book {
      title: String!
      price: Int!
    }
    type Query {
      textBook: Textbook
    }
  `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      interface Book {
        title: string;
      }
      export interface Textbook extends Book {
        __typename: "Textbook";
        title: string;
        price: number;
      }
    `);
  });

  it('prints a complex schema', () => {
    const schema = buildSchema(`
      enum Episode {
        FOUR
        FIVE
        SIX
      }

      enum Season {
        FIRST
        SECOND
        THIRD
      }

      type Unit {
        season: Season!
        episode: Episode!
      }

      scalar Date

      input InputOne {
        dates: [Date]!
        episodes: [Episode!]!
        inputs: [InputTwo]
      }

      input InputTwo {
        name: String
        episode: Episode!
        season: Season!
        date: Date
      }

      type Mutation {
        getOne(input: InputOne): Unit!
        getTwo(input: InputTwo): Unit!

      }
    `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      import { Season } from "./Season";
      import { Episode } from "./Episode";
      export { Season };
      export { Episode };
      export interface Unit {
        __typename: "Unit";
        season: Season;
        episode: Episode;
      }
      export type Date = string;
      export interface InputTwo {
        name?: string | null;
        episode: Episode;
        season: Season;
        date?: Date | null;
      }
      export interface InputOne {
        dates: (Date | null)[];
        episodes: Episode[];
        inputs?: (InputTwo | null)[] | null;
      }
    `);
  });

  it('prints Query/Mutation interfaces', () => {
    const schema = buildSchema(`
    union Price = Int | String

    type Money {
      amount: Price!
    }

    type Product {
      retailPrice: Money!
      title: String!
    }

    type Query {
      products(first: Int): [Product]!
    }

    type Mutation {
      updateProduct(price: Money): Product!
    }
  `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
    export type Price = number | string;
    export interface Money {
      __typename: "Money";
      amount: Price;
    }
    export interface Product {
      __typename: "Product";
      retailPrice: Money;
      title: string;
    }
    export interface Query {
      products: (Product | null)[];
    }
    export interface Mutation {
      updateProduct: Product;
    }
    `);
  });

  it('prints a primitive list type', () => {
    const schema = buildSchema(`
    type Product {
      tags: [String]!
    }

    type Query {
      tags: [String!]!
      product: Product!
    }
  `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      export interface Product {
        __typename: "Product";
        tags: (string | null)[];
      }
      export interface Query {
        tags: string[];
        product: Product;
      }
    `);
  });

  it('prints a reference list type', () => {
    const schema = buildSchema(`
    type Tag {
      name: String!
    }

    type Product {
      tags: [Tag!]!
    }

    type Query {
      product: Product!
    }
  `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
    export interface Tag {
      __typename: "Tag";
      name: string;
    }
    export interface Product {
      __typename: "Product";
      tags: Tag[];
    }
    `);
  });

  it('prints nullable/non-nullable types', () => {
    const schema = buildSchema(`
    union Color = String | Int

    type Option {
      one: [String!]!
      two: [String]!
      three: [String]
    }

    type Product {
      option: Option
      optionRequired: Option!
      one: String!
      two: String
      color: Color
      colorRequired: Color!
    }

    type Query {
      product: Product!
    }
  `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      export interface Option {
        __typename: "Option";
        one: string[];
        two: (string | null)[];
        three?: (string | null)[] | null;
      }
      export type Color = string | number;
      export interface Product {
        __typename: "Product";
        option?: Option | null;
        optionRequired: Option;
        one: string;
        two?: string | null;
        color?: Color | null;
        colorRequired: Color;
      }
      export interface Query {
        product: Product;
      }
  `);
  });

  it('prints self referencing types', () => {
    const schema = buildSchema(`
      type Person {
        self: Person!
        relatives: [Person!]!
      }

      type Query {
        person: Person
      }
    `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      export interface Person {
        __typename: "Person";
        self: Person;
        relatives: Person[];
      }
      export interface Query {
        person?: Person | null;
      }
    `);
  });

  it('prints ordered types', () => {
    const schema = buildSchema(`
      type Mutation {
        setTwo(input: InputTwo): Unit!
        setOne(input: InputOne): Unit!
      }

      input InputOne {
        dates: [Date]!
        episodes: [Episode!]!
        inputs: [InputTwo]
      }

      input InputTwo {
        name: String
        episode: Episode!
        season: Season!
        date: Date
      }

      scalar Date

      enum Episode {
        FOUR
        FIVE
        SIX
      }

      enum Season {
        FIRST
        SECOND
        THIRD
      }

      type Query {
        getOne: Unit!
      }

      type Unit {
        season: Season!
        episode: Episode!
      }
    `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      import { Season } from "./Season";
      import { Episode } from "./Episode";
      export { Season };
      export { Episode };
      export interface Unit {
        __typename: "Unit";
        season: Season;
        episode: Episode;
      }
      export type Date = string;
      export interface InputTwo {
        name?: string | null;
        episode: Episode;
        season: Season;
        date?: Date | null;
      }
      export interface InputOne {
        dates: (Date | null)[];
        episodes: Episode[];
        inputs?: (InputTwo | null)[] | null;
      }
      export interface Query {
        getOne: Unit;
      }
      export interface Mutation {
        setTwo: Unit;
        setOne: Unit;
      }
    `);
  });
});
