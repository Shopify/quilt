// eslint-disable-next-line @shopify/typescript/prefer-build-client-schema
import {buildSchema} from 'graphql';
import {stripIndent} from 'common-tags';

import {generateSchemaTypes} from '../src/print/schema';
import {EnumFormat, EnumStyle} from '../src/types';

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
  });

  it('prints a unambiguous es module file if nothing would otherwise be exported', () => {
    const schema = buildSchema('type Query {getValue: String}');
    expect(generateSchemaTypes(schema).get('index.ts')).toBe('export {};');
  });

  it('prints a custom scalar in the index file', () => {
    const schema = buildSchema('scalar Date');
    expect(generateSchemaTypes(schema).get('index.ts')).toContain(
      'export type Date = string;',
    );
  });

  it('does not print a built-in scalar in the index file', () => {
    const schema = buildSchema('scalar Date');
    expect(generateSchemaTypes(schema).get('index.ts')).not.toContain(
      'export type String',
    );
  });

  it('prints a custom scalar with a specified import type in the index file', () => {
    const schema = buildSchema(`
      scalar HtmlSafeString
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

  it('uses a different name for a custom import type when it is defined for multiple scalars', () => {
    const schema = buildSchema(`
      scalar HtmlSafeString
      scalar FormattedString
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

  it('prints a custom scalar without a package import', () => {
    const schema = buildSchema(`
      scalar Seconds
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

  it('prints an input object in the index file', () => {
    const schema = buildSchema(`
      input Input {
        name: String!
      }
    `);

    expect(generateSchemaTypes(schema).get('index.ts')).toContain(stripIndent`
      export interface Input {
        name: string;
      }
    `);
  });

  it('generates files per enum if enumstyle is "enum"', () => {
    const schema = buildSchema(`
      enum Gandalf {
        WHITE
        GREY
      }

      enum Permissions {
        SHALL_PASS
        SHALL_NOT_PASS
      }
    `);
    const schemaTypes = generateSchemaTypes(schema);
    expect(schemaTypes.get('index.ts')).toBe(stripIndent`
    import { Gandalf } from \"./Gandalf\";
    import { Permissions } from \"./Permissions\";
    export { Gandalf };
    export { Permissions };
    `);
    expect(schemaTypes.get('Gandalf.ts')).toBe(stripIndent`
    export enum Gandalf {
      WHITE = "WHITE",
      GREY = "GREY",
    }
    `);
    expect(schemaTypes.get('Permissions.ts')).toBe(stripIndent`
    export enum Permissions {
      SHALL_PASS = "SHALL_PASS",
      SHALL_NOT_PASS = "SHALL_NOT_PASS",
    }
    `);
  });

  it('generates union types in index file if enumstyle is "type"', () => {
    const schema = buildSchema(`
      enum Gandalf {
        WHITE
        GREY
      }

      enum Permissions {
        SHALL_PASS
        SHALL_NOT_PASS
      }
    `);
    const schemaTypes = generateSchemaTypes(schema, {
      enumStyle: EnumStyle.Type,
    });

    expect(schemaTypes.get('index.ts')).toBe(stripIndent`
    export type Gandalf = "WHITE" | "GREY";
    export type Permissions = "SHALL_PASS" | "SHALL_NOT_PASS";
    `);
    expect(schemaTypes.has('Gandalf.ts')).toBe(false);
    expect(schemaTypes.has('Permissions.ts')).toBe(false);
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
    `);

    const schemaTypes = generateSchemaTypes(schema);
    expect(schemaTypes.get('index.ts')).toBe(stripIndent`
      import { Episode } from "./Episode";
      import { Season } from "./Season";
      export { Episode };
      export { Season };
      export type Date = string;
      export interface InputOne {
        dates: (Date | null)[];
        episodes: Episode[];
        inputs?: (InputTwo | null)[] | null;
      }
      export interface InputTwo {
        name?: string | null;
        episode: Episode;
        season: Season;
        date?: Date | null;
      }
    `);
  });
});
