import {resolve} from 'path';

import {Builder} from '../src/index';

type Fixture = [filename: string, schemaCount: number, documentCount: number];

const rootFixturePath = resolve(__dirname, 'fixtures');
const fixtures: Fixture[] = [
  ['all-clear', 1, 2],
  ['all-clear-legacy', 1, 2],
  ['multiple-schemas', 2, 4],
  ['multiple-schemas-legacy', 2, 4],
];

describe.each<Fixture>(fixtures)(
  '[%s] Builder',
  (fixture, schemaCount, documentCount) => {
    it('only calls generateDocumentTypes() once on startup in watch mode', async () => {
      const fixtureDirectory = resolve(rootFixturePath, fixture);
      const builder = new Builder({
        addTypename: true,
        cwd: fixtureDirectory,
        schemaTypesPath: fixtureDirectory,
      });
      const startDocs = jest.fn();

      try {
        builder.on('start:docs', startDocs);

        await builder.run({watch: true});
      } finally {
        builder.stop();
      }

      expect(startDocs).toHaveBeenCalledTimes(1);
    });

    it('calls build emitters for schema and docs of each fixture def', async () => {
      const fixtureDirectory = resolve(rootFixturePath, fixture);
      const builder = new Builder({
        addTypename: true,
        cwd: fixtureDirectory,
        schemaTypesPath: fixtureDirectory,
      });

      const schema = jest.fn();
      const docs = jest.fn();

      try {
        builder.on('build:schema', schema);
        builder.on('build:docs', docs);

        await builder.run({watch: true});
      } finally {
        builder.stop();
      }

      expect(schema).toHaveBeenCalledTimes(schemaCount);
      expect(docs).toHaveBeenCalledTimes(documentCount);
    });
  },
);
