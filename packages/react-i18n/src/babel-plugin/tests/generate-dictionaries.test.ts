import path from 'path';

import {readFile, remove} from 'fs-extra';

import {generateTranslationDictionaries} from '../generate-dictionaries';

const rootDir = path.join(
  __dirname,
  'fixtures',
  'dictionaryTranslations',
  'translations',
);

describe('generate-dictionaries', () => {
  afterEach(async () => {
    await remove(path.join(rootDir, 'index.js'));
    // Clear the generated index.js file out of the require cache.
    jest.resetModules();
  });

  it('combines requested locales into an index dictionary', async () => {
    await generateTranslationDictionaries(['es', 'de'], {rootDir});

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dictionary = require(`${rootDir}/index`);
    expect(Object.keys(dictionary.default)).toStrictEqual(['es', 'de']);
  });

  it('merges fallback translations into missing locale translations', async () => {
    await generateTranslationDictionaries(['es', 'de'], {
      rootDir,
      fallbackLocale: 'en',
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dictionary = require(`${rootDir}/index`);
    expect(Object.keys(dictionary.default)).toStrictEqual(['es', 'de']);
    expect(dictionary.default.es).toStrictEqual({
      Foo: 'foo_es',
      Bar: 'bar_es',
    });
    expect(dictionary.default.de).toStrictEqual({
      Foo: 'foo_de',
      Bar: 'bar_en',
    });
  });

  it('encodes the dictionary as a JSON string for faster browser parsing speed', async () => {
    await generateTranslationDictionaries(['en'], {
      rootDir,
    });

    const dictionary = await readFile(`${rootDir}/index.js`);

    expect(dictionary.toString()).toStrictEqual(
      `export default JSON.parse("{\\"en\\":{\\"Foo\\":\\"foo_en\\",\\"Bar\\":\\"bar_en\\"}}")`,
    );
  });
});
