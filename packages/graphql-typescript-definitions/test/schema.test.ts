import {buildSchema} from 'graphql';
import {stripIndent} from 'common-tags';

import {printSchema} from '../src/print/schema';
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
    `);

    it('prints an enum with cases matching value names', () => {
      expect(printSchema(schema)).toContain(stripIndent`
        export enum Episode {
          NEW_HOPE = "NEW_HOPE",
          EMPIRE = "EMPIRE",
          JEDI = "JEDI",
          FORCE_AWAKENS = "FORCE_AWAKENS",
          LAST_JEDI = "LAST_JEDI",
        }
      `);
    });

    it('prints an enum with screaming snake case names', () => {
      expect(printSchema(schema, {enumFormat: EnumFormat.ScreamingSnakeCase}))
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

    it('prints an enum with snake case names', () => {
      expect(printSchema(schema, {enumFormat: EnumFormat.SnakeCase}))
        .toContain(stripIndent`
        export enum Episode {
          new_hope = "NEW_HOPE",
          empire = "EMPIRE",
          jedi = "JEDI",
          force_awakens = "FORCE_AWAKENS",
          last_jedi = "LAST_JEDI",
        }
      `);
    });

    it('prints an enum with camelcase names', () => {
      expect(printSchema(schema, {enumFormat: EnumFormat.CamelCase}))
        .toContain(stripIndent`
        export enum Episode {
          newHope = "NEW_HOPE",
          empire = "EMPIRE",
          jedi = "JEDI",
          forceAwakens = "FORCE_AWAKENS",
          lastJedi = "LAST_JEDI",
        }
      `);
    });

    it('prints an enum with pascal case names', () => {
      expect(printSchema(schema, {enumFormat: EnumFormat.PascalCase}))
        .toContain(stripIndent`
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

  it('prints a custom scalar', () => {
    const schema = buildSchema('scalar Date');
    expect(printSchema(schema)).toContain('export type Date = string;');
  });

  it('does not print a built-in scalar', () => {
    const schema = buildSchema('scalar Date');
    expect(printSchema(schema)).not.toContain('export type String');
  });

  it('prints an input object', () => {
    const schema = buildSchema(`
      input Input {
        name: String!
      }
    `);

    expect(printSchema(schema)).toContain(stripIndent`
      export interface Input {
        name: string;
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

      scalar Date

      input InputOne {
        dates: [Date]!
        episodes: [Episode!]!
        inputs: [InputTwo]
      }

      input InputTwo {
        name: String
        episode: Episode!
        date: Date
      }
    `);

    expect(printSchema(schema)).toContain(stripIndent`
      export enum Episode {
        FOUR = "FOUR",
        FIVE = "FIVE",
        SIX = "SIX",
      }
      export type Date = string;
      export interface InputOne {
        dates: (Date | null)[];
        episodes: Episode[];
        inputs?: (InputTwo | null)[] | null;
      }
      export interface InputTwo {
        name?: string | null;
        episode: Episode;
        date?: Date | null;
      }
    `);
  });
});
