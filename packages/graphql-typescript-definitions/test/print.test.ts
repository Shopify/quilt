import {getDefinitionsForFixture, createMatcher} from './helpers';

describe('printing', () => {
  describe('queries', () => {
    it('exports an interface for a query', () => {
      const definitions = getDefinitionsForFixture('basic/Query.graphql');
      expect(definitions).toMatch(/export interface MyQuery/);
    });

    it('exports a DocumentNode as the default export', () => {
      const definitions = getDefinitionsForFixture('basic/Query.graphql');

      expect(definitions).toMatch(createMatcher(`
        import {DocumentNode} from 'graphql';
      `));

      expect(definitions).toMatch(createMatcher(`
        declare const document: DocumentNode;
        export default document;
      `));
    });
  });

  describe('fragments', () => {
    it('exports an interface for a fragment', () => {
      const definitions = getDefinitionsForFixture('basic/Fragment.graphql');
      expect(definitions).toMatch(/export interface MyFragment/);
    });

    it('exports a DocumentNode as the default export', () => {
      const definitions = getDefinitionsForFixture('basic/Fragment.graphql');

      expect(definitions).toMatch(createMatcher(`
        import {DocumentNode} from 'graphql';
      `));

      expect(definitions).toMatch(createMatcher(`
        declare const document: DocumentNode;
        export default document;
      `));
    });
  });

  describe('types', () => {
    it('handles primitive field types', () => {
      const definitions = getDefinitionsForFixture('types/Primitives.graphql');

      expect(definitions).toMatch(createMatcher(`
        interface Types {
          id: string,
          name: string,
          age: number,
          weight: number,
          married: boolean,
        }
      `));
    });

    it('handles nullable fields', () => {
      const definitions = getDefinitionsForFixture('types/Nullable.graphql');

      expect(definitions).toMatch(createMatcher(`
        interface Nullable {
          unit: string | null,
        }
      `));
    });

    it.only('handles lists', () => {
      const definitions = getDefinitionsForFixture('types/List.graphql');

      expect(definitions).toMatch(createMatcher(`
        interface List {
          bestBirthdays: number[],
          childAges: (number | null)[],
          petAges: number[] | null,
          addresses: {
            number: number,
          }[],
        }
      `));
    });
  });

  describe('spreads', () => {
    it('uses a named fragment as a type', () => {
      const definitions = getDefinitionsForFixture('spreads/ExternalFragment.graphql');
      expect(definitions).toMatch(createMatcher(`
        interface ExternalFragment {
          addresses: MyFragment[],
        }
      `));
    });

    it('uses a named fragment and additional fields', () => {
      const definitions = getDefinitionsForFixture('spreads/ExternalAndFields.graphql');
      expect(definitions).toMatch(createMatcher(`
        interface ExternalAndFields {
          addresses: (MyFragment & {
            unit: string | null,
          })[],
        }
      `));
    });

    it('uses a named fragment and an inline fragment', () => {
      const definitions = getDefinitionsForFixture('spreads/ExternalAndInline.graphql');
      expect(definitions).toMatch(createMatcher(`
        interface ExternalAndInline {
          addresses: (MyFragment & {
            unit: string | null,
          })[],
        }
      `));
    });
  });
});
