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

describe('Manifests user agents', () => {
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

  const scriptOne = 'script-one.js';
  const scriptTwo = 'script-two.js';
  const chrome71 =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

  it('uses the last manifest when no useragent exists', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(scriptOne)],
            }),
          },
        }),

        mockManifest({
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(scriptTwo)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(undefined);

    expect(manifest.entrypoints.main.js[0]).toStrictEqual({
      path: scriptTwo,
    });
  });

  it('uses the last manifest when no manifest matches', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          browsers: ['firefox > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(scriptOne)],
            }),
          },
        }),

        mockManifest({
          browsers: ['safari > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(scriptTwo)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71);

    expect(manifest.entrypoints.main.js[0]).toStrictEqual({
      path: scriptTwo,
    });
  });

  it('uses the first matching manifest', async () => {
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        mockManifest({
          browsers: ['chrome > 60'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(scriptOne)],
            }),
          },
        }),
        mockManifest({
          browsers: ['chrome > 1'],
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(scriptTwo)],
            }),
          },
        }),
      ]),
    );

    const manifests = new Manifests();
    const manifest = await manifests.resolve(chrome71);

    expect(manifest.entrypoints.main.js[0]).toStrictEqual({
      path: scriptOne,
    });
  });
});
