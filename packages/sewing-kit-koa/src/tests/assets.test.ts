import {join, basename} from 'path';
import appRoot from 'app-root-path';
import withEnv from '@shopify/with-env';
import Assets, {
  internalOnlyClearCache,
  Asset,
  AsyncAsset,
  ConsolidatedManifest,
  Manifest,
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
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        {entrypoints: {main: mockEntrypoint()}, asyncAssets: {}},
      ]),
    );
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
          mockManifest({
            entrypoints: {
              main: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts()).toStrictEqual([{path: js}]);
    });

    it('returns the scripts for a named bundle', async () => {
      const js = '/style.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts({name: 'custom'})).toStrictEqual([
        {path: js},
      ]);
    });

    it('prefixes async assets matching the passed IDs', async () => {
      const js = '/custom.js';
      const asyncJs = '/used.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            },
            asyncAssets: {
              unused: [mockAsyncAsset('/unused.js')],
              used: [mockAsyncAsset(asyncJs), mockAsyncAsset('/used.css')],
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(
        await assets.scripts({name: 'custom', asyncAssets: ['used']}),
      ).toStrictEqual([{path: asyncJs}, {path: js}]);
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
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            },
          }),
        ]),
      );

      const assets = new Assets({...defaultOptions, assetPrefix});
      const scripts = await withEnv('development', () =>
        assets.scripts({name: 'custom'}),
      );

      expect(scripts).toStrictEqual([
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
          mockManifest({
            entrypoints: {
              main: mockEntrypoint({
                styles: [mockAsset(css)],
              }),
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.styles()).toStrictEqual([{path: css}]);
    });

    it('returns the styles for a named bundle', async () => {
      const css = '/style.css';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                styles: [mockAsset(css)],
              }),
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.styles({name: 'custom'})).toStrictEqual([
        {path: css},
      ]);
    });

    it('prefixes async assets matching the passed IDs', async () => {
      const css = '/custom.css';
      const asyncCss = '/used.css';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                styles: [mockAsset(css)],
              }),
            },
            asyncAssets: {
              unused: [mockAsyncAsset('/unused.js')],
              used: [mockAsyncAsset(asyncCss), mockAsyncAsset('/used.js')],
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(
        await assets.styles({name: 'custom', asyncAssets: ['used']}),
      ).toStrictEqual([{path: asyncCss}, {path: css}]);
    });

    it('throws an error when no styles exist for the passed entrypoint', async () => {
      const assets = new Assets(defaultOptions);
      await expect(
        assets.styles({name: 'non-existent'}),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('assets', () => {
    it('returns all assets for the specified bundles', async () => {
      const css = '/style.css';
      const asyncCss = '/mypage.css';
      const js = '/script.js';
      const asyncJs = 'mypage.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                styles: [mockAsset(css)],
                scripts: [mockAsset(js)],
              }),
            },
            asyncAssets: {
              mypage: [mockAsyncAsset(asyncCss), mockAsyncAsset(asyncJs)],
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(
        await assets.assets({name: 'custom', asyncAssets: ['mypage']}),
      ).toStrictEqual([
        {path: css},
        {path: asyncCss},
        {path: asyncJs},
        {path: js},
      ]);
    });
  });

  describe('asyncStyles', () => {
    it('returns all async styles for the specified ids', async () => {
      const asyncCss = '/mypage.css';
      const css = '/main.css';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              main: mockEntrypoint({
                styles: [mockAsset(css)],
              }),
            },
            asyncAssets: {
              other: [mockAsyncAsset('/other.css')],
              mypage: [mockAsyncAsset(asyncCss)],
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.asyncStyles({id: ['mypage']})).toStrictEqual([
        {path: asyncCss},
      ]);
    });
  });

  describe('asyncScripts', () => {
    it('returns all async styles for the specified ids', async () => {
      const asyncJs = '/mypage.js';
      const js = '/main.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              main: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            },
            asyncAssets: {
              other: [mockAsyncAsset('/other.js')],
              mypage: [mockAsyncAsset(asyncJs)],
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.asyncScripts({id: ['mypage']})).toStrictEqual([
        {path: asyncJs},
      ]);
    });
  });

  describe('asyncAssets', () => {
    it('returns all async assets for the specified ids', async () => {
      const css = '/style.css';
      const asyncCss = '/mypage.css';
      const js = '/script.js';
      const asyncJs = 'mypage.js';

      readJson.mockImplementation(() =>
        mockConsolidatedManifest([
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                styles: [mockAsset(css)],
                scripts: [mockAsset(js)],
              }),
            },
            asyncAssets: {
              mypage: [mockAsyncAsset(asyncCss), mockAsyncAsset(asyncJs)],
            },
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.asyncAssets({id: ['mypage']})).toStrictEqual([
        {path: asyncCss},
        {path: asyncJs},
      ]);
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

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts()).toStrictEqual([{path: scriptTwo}]);
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

      const assets = new Assets({...defaultOptions, userAgent: chrome71});

      expect(await assets.scripts()).toStrictEqual([{path: scriptTwo}]);
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

      const assets = new Assets({...defaultOptions, userAgent: chrome71});

      expect(await assets.scripts()).toStrictEqual([{path: scriptOne}]);
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

function mockManifest({
  name = 'mockedManifest',
  browsers,
  entrypoints = {},
  asyncAssets = {},
}: Partial<Manifest>): Manifest {
  return {
    name,
    browsers,
    entrypoints,
    asyncAssets,
  };
}

function mockConsolidatedManifest(manifests: Manifest[]): ConsolidatedManifest {
  return manifests;
}
