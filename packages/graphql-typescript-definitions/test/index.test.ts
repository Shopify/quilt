import {resolve} from 'path';
import {Builder} from '../src/index';

const rootFixturePath = resolve(__dirname, 'fixtures');

describe('Builder', () => {
  it('only calls generateDocumentTypes() once on startup in watch mode', async () => {
    const fixtureDirectory = resolve(rootFixturePath, 'all-clear');
    const builder = new Builder({
      addTypename: true,
      cwd: fixtureDirectory,
      schemaTypesPath: fixtureDirectory,
    });
    const fn = jest.fn();

    try {
      builder.on('start:docs', fn);

      await builder.run({watch: true});
    } finally {
      builder.stop();
    }
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
