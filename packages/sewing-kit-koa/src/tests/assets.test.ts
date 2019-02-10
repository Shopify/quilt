import {join, basename} from 'path';
import withEnv from '@shopify/with-env';
import appRoot from 'app-root-path';
import Assets, {
  internalOnlyClearCache,
  Asset,
  AsyncAsset,
  Entrypoint,
  ConsolidatedManifestEntry,
  ConsolidatedManifest,
} from '../assets';

jest.mock('fs-extra', () => ({
  ...require.requireActual('fs-extra'),
  readJson: jest.fn(() => []),
}));

const {readJson} = require.requireMock('fs-extra');

describe('Assets', () => {
  const defaultOptions = {assetPrefix: '/assets/'};

  beforeEach(() => {
    readJson.mockReset();
    readJson.mockImplementation(() => mockConsolidatedManifest());
  });

  afterEach(() => {
    internalOnlyClearCache();
  });

  it('reads the asset cache', async () => {
    const assets = new Assets(defaultOptions);

    await assets.styles();

    expect(readJson).toHaveBeenCalledWith(
      join(appRoot.path, 'build/client/assets.json'),
    );
  });

  it('only reads the asset cache once', async () => {
    await new Assets(defaultOptions).styles();
    await new Assets(defaultOptions).scripts();

    expect(readJson).toHaveBeenCalledTimes(1);
  });

  describe('scripts', () => {
    it('returns the main scripts by default', async () => {
      const js = '/style.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest({
              main: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts()).toEqual([{path: js}]);
    });

    it('returns the scripts for a named bundle', async () => {
      const js = '/style.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest({
              custom: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts({name: 'custom'})).toEqual([{path: js}]);
    });

    it('prefixes async assets matching the passed IDs', async () => {
      const js = '/custom.js';
      const asyncJs = '/used.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest(
              {
                custom: mockEntrypoint({
                  scripts: [mockAsset(js)],
                }),
              },
              {
                unused: [mockAsyncAsset('/unused.js')],
                used: [mockAsyncAsset(asyncJs), mockAsyncAsset('/used.css')],
              },
            ),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(
        await assets.scripts({name: 'custom', asyncAssets: ['used']}),
      ).toEqual([{path: asyncJs}, {path: js}]);
    });

    it('throws an error when no scripts exist for the passed entrypoint', async () => {
      const assets = new Assets(defaultOptions);
      await expect(
        assets.scripts({name: 'non-existent'}),
      ).rejects.toBeInstanceOf(Error);
    });

    it('prefixes the list with the vendor DLL in development', async () => {
      const js = '/style.js';
      const assetPrefix = '/sewing-kit-assets/';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest({
              custom: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets({...defaultOptions, assetPrefix});
      const scripts = await withEnv('development', () =>
        assets.scripts({name: 'custom'}),
      );

      expect(scripts).toEqual([
        {path: `${assetPrefix}dll/vendor.js`},
        {path: js},
      ]);
    });
  });

  describe('styles', () => {
    it('returns the main styles by default', async () => {
      const css = '/style.css';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest({
              main: mockEntrypoint({
                styles: [mockAsset(css)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.styles()).toEqual([{path: css}]);
    });

    it('returns the styles for a named bundle', async () => {
      const css = '/style.css';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest({
              custom: mockEntrypoint({
                styles: [mockAsset(css)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.styles({name: 'custom'})).toEqual([{path: css}]);
    });

    it('prefixes async assets matching the passed IDs', async () => {
      const css = '/custom.css';
      const asyncCss = '/used.css';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest(
              {
                custom: mockEntrypoint({
                  styles: [mockAsset(css)],
                }),
              },
              {
                unused: [mockAsyncAsset('/unused.js')],
                used: [mockAsyncAsset(asyncCss), mockAsyncAsset('/used.js')],
              },
            ),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(
        await assets.styles({name: 'custom', asyncAssets: ['used']}),
      ).toEqual([{path: asyncCss}, {path: css}]);
    });

    it('throws an error when no styles exist for the passed entrypoint', async () => {
      const assets = new Assets(defaultOptions);
      await expect(
        assets.styles({name: 'non-existent'}),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('userAgent', () => {
    const scriptOne = 'script-one.js';
    const scriptTwo = 'script-two.js';
    const chrome71 =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

    it('uses the last manifest when no useragent exists', async () => {
      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            manifest: mockManifest({
              main: mockEntrypoint({
                scripts: [mockAsset(scriptOne)],
              }),
            }),
          }),
          mockManifestEntry({
            manifest: mockManifest({
              main: mockEntrypoint({
                scripts: [mockAsset(scriptTwo)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts()).toEqual([{path: scriptTwo}]);
    });

    it('uses the last manifest when no manifest matches', async () => {
      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            browsers: ['firefox > 1'],
            manifest: mockManifest({
              main: mockEntrypoint({
                scripts: [mockAsset(scriptOne)],
              }),
            }),
          }),
          mockManifestEntry({
            browsers: ['safari > 1'],
            manifest: mockManifest({
              main: mockEntrypoint({
                scripts: [mockAsset(scriptTwo)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets({...defaultOptions, userAgent: chrome71});

      expect(await assets.scripts()).toEqual([{path: scriptTwo}]);
    });

    it('uses the first matching manifest', async () => {
      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifestEntry({
            browsers: ['chrome > 60'],
            manifest: mockManifest({
              main: mockEntrypoint({
                scripts: [mockAsset(scriptOne)],
              }),
            }),
          }),
          mockManifestEntry({
            browsers: ['chrome > 1'],
            manifest: mockManifest({
              main: mockEntrypoint({
                scripts: [mockAsset(scriptTwo)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets({...defaultOptions, userAgent: chrome71});

      expect(await assets.scripts()).toEqual([{path: scriptOne}]);
    });
  });
});

function mockAsset(path: string): Asset {
  return {path};
}

function mockAsyncAsset(path: string): AsyncAsset {
  return {publicPath: path, file: basename(path)};
}

function mockEntrypoint({
  scripts = [],
  styles = [],
}: {
  scripts?: Asset[];
  styles?: Asset[];
} = {}) {
  return {js: scripts, css: styles};
}

function mockManifest(
  entrypoints: {[key: string]: Entrypoint} = {},
  asyncAssets: {[key: string]: AsyncAsset[]} = {},
) {
  return {entrypoints, asyncAssets};
}

function mockManifestEntry({
  name = 'bundle',
  browsers,
  manifest = mockManifest({main: mockEntrypoint()}),
}: Partial<ConsolidatedManifestEntry> = {}) {
  return {name, browsers, manifest};
}

function mockConsolidatedManifest(
  manifests: ConsolidatedManifestEntry[] = [mockManifestEntry()],
): ConsolidatedManifest {
  return manifests;
}
