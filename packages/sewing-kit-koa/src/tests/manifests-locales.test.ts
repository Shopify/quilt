import {
  internalOnlyClearCache as clearManifestsCache,
  Manifests,
} from '../manifests';

import {
  mockAsset,
  mockConsolidatedManifest,
  mockEntrypoint,
  mockManifest,
} from './test-utilities';

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  pathExists: jest.fn(() => Promise.resolve(false)),
  readFile: jest.fn(() => '[]'),
  readJson: jest.fn(() => []),
}));

const {pathExists, readFile, readJson} = jest.requireMock('fs-extra');

describe('Manifests locales', () => {
  beforeEach(() => {
    pathExists.mockReset();
    pathExists.mockReturnValue(Promise.resolve(false));

    readFile.mockReset();

    readJson.mockReset();
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        {entrypoints: {main: mockEntrypoint()}, asyncAssets: {}},
      ]),
    );
  });

  afterEach(() => {
    clearManifestsCache();
  });

  const enScriptOne = 'en-script-one.js';
  const enScriptTwo = 'en-script-two.js';
  const frScriptOne = 'fr-script-one.js';
  const noLocaleScriptOne = 'no-locale-script-one.js';
  const noLocaleScriptTwo = 'no-locale-script-two.js';

  const chrome71 =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

  it('uses the first manifest with a compatible user-agent and locale', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['fr']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(frScriptOne)],
            }),
          },
        }),
        mockManifest({
          browsers: ['chrome > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptTwo)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71, {
      locale: 'fr',
    });

    expect(manifest).toHaveProperty('entrypoints.main.js.0.path', frScriptOne);
  });

  it('uses the first manifest with a compatible user-agent and matching multi-locale', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['de', 'fr']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(frScriptOne)],
            }),
          },
        }),
        mockManifest({
          browsers: ['chrome > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptTwo)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71, {
      locale: 'fr',
    });

    expect(manifest).toHaveProperty('entrypoints.main.js.0.path', frScriptOne);
  });

  it('falls back to the most-polyfilled build for a locale', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 74'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset('en-chrome74.js')],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 73'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
        mockManifest({
          browsers: ['chrome > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset('noLocale-chrome1.js')],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71, {
      locale: 'en',
    });

    expect(manifest).toHaveProperty('entrypoints.main.js.0.path', enScriptOne);
  });

  it('falls back to the first manifest with a compatible user-agent and a non-locale build', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
        mockManifest({
          browsers: ['chrome > 70'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(noLocaleScriptOne)],
            }),
          },
        }),
        mockManifest({
          browsers: ['chrome > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(noLocaleScriptTwo)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71, {
      locale: 'pt-BR',
    });

    expect(manifest).toHaveProperty(
      'entrypoints.main.js.0.path',
      noLocaleScriptOne,
    );
  });

  it('falls back to the last manifest when nothing matches', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
        mockManifest({
          browsers: ['safari > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(noLocaleScriptOne)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71, {
      locale: 'pt-BR',
    });

    expect(manifest).toHaveProperty(
      'entrypoints.main.js.0.path',
      noLocaleScriptOne,
    );
  });

  it('prefers variant locales', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['it']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset('it.js')],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['it-VA']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset('it-va.js')],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71, {
      locale: 'it-VA',
    });

    expect(manifest).toHaveProperty('entrypoints.main.js.0.path', 'it-va.js');
  });

  it('falls back to parent locale if a variant build does not exist', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['it']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset('it.js')],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71, {
      locale: 'it-VA',
    });

    expect(manifest).toHaveProperty('entrypoints.main.js.0.path', 'it.js');
  });

  it('returns the fallbackLocale‘s most polyfilled build when an unknown locale is requested and non-locale builds do not exist', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['fr']},
          browsers: ['chrome > 50'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(frScriptOne)],
            }),
          },
        }),
        mockManifest({
          identifier: {locales: ['en']},
          browsers: ['chrome > 50'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(enScriptOne)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      {
        locale: 'jp',
      },
    );

    expect(manifest).toHaveProperty('entrypoints.main.js.0.path', enScriptOne);
  });
});
