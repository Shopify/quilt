import {buildSchema} from 'graphql';
import {stripIndent} from 'common-tags';
import {printSchema} from '../src/print/schema';

describe('printSchema()', () => {
  it('prints an enum', () => {
    const schema = buildSchema(`
      enum Episode {
        FOUR
        FIVE
        SIX
        SEVEN
        EIGHT
      }
    `);

    expect(printSchema(schema)).toContain(stripIndent`
      export enum Episode {
        FOUR = "FOUR",
        FIVE = "FIVE",
        SIX = "SIX",
        SEVEN = "SEVEN",
        EIGHT = "EIGHT",
      }
    `);
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
