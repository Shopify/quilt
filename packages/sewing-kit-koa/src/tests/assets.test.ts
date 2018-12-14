import {join} from 'path';
import withEnv from '@shopify/with-env';
import appRoot from 'app-root-path';
import Assets, {
  internalOnlyClearCache,
  Asset,
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
  const defaultOptions = {assetHost: '/assets/'};

  beforeEach(() => {
    readJson.mockReset();
    readJson.mockImplementation(() => createMockConsolidatedManifest());
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
        createMockConsolidatedManifest([
          createMockManifestEntry({
            manifest: createMockManifest({
              main: createMockEntrypoint({
                scripts: [createMockAsset(js)],
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
        createMockConsolidatedManifest([
          createMockManifestEntry({
            manifest: createMockManifest({
              custom: createMockEntrypoint({
                scripts: [createMockAsset(js)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts({name: 'custom'})).toEqual([{path: js}]);
    });

    it('throws an error when no scripts exist for the passed entrypoint', async () => {
      const assets = new Assets(defaultOptions);
      await expect(
        assets.scripts({name: 'non-existent'}),
      ).rejects.toBeInstanceOf(Error);
    });

    it('prefixes the list with the vendor DLL in development', async () => {
      const js = '/style.js';
      const assetHost = '/sewing-kit-assets/';

      readJson.mockImplementation(() =>
        createMockConsolidatedManifest([
          createMockManifestEntry({
            manifest: createMockManifest({
              custom: createMockEntrypoint({
                scripts: [createMockAsset(js)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets({...defaultOptions, assetHost});
      const scripts = await withEnv('development', () =>
        assets.scripts({name: 'custom'}),
      );

      expect(scripts).toEqual([
        {path: `${assetHost}dll/vendor.js`},
        {path: js},
      ]);
    });
  });

  describe('styles', () => {
    it('returns the main styles by default', async () => {
      const css = '/style.css';

      readJson.mockImplementation(() =>
        createMockConsolidatedManifest([
          createMockManifestEntry({
            manifest: createMockManifest({
              main: createMockEntrypoint({
                styles: [createMockAsset(css)],
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
        createMockConsolidatedManifest([
          createMockManifestEntry({
            manifest: createMockManifest({
              custom: createMockEntrypoint({
                styles: [createMockAsset(css)],
              }),
            }),
          }),
        ]),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.styles({name: 'custom'})).toEqual([{path: css}]);
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
        createMockConsolidatedManifest([
          createMockManifestEntry({
            manifest: createMockManifest({
              main: createMockEntrypoint({
                scripts: [createMockAsset(scriptOne)],
              }),
            }),
          }),
          createMockManifestEntry({
            manifest: createMockManifest({
              main: createMockEntrypoint({
                scripts: [createMockAsset(scriptTwo)],
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
        createMockConsolidatedManifest([
          createMockManifestEntry({
            browsers: ['firefox > 1'],
            manifest: createMockManifest({
              main: createMockEntrypoint({
                scripts: [createMockAsset(scriptOne)],
              }),
            }),
          }),
          createMockManifestEntry({
            browsers: ['safari > 1'],
            manifest: createMockManifest({
              main: createMockEntrypoint({
                scripts: [createMockAsset(scriptTwo)],
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
        createMockConsolidatedManifest([
          createMockManifestEntry({
            browsers: ['chrome > 60'],
            manifest: createMockManifest({
              main: createMockEntrypoint({
                scripts: [createMockAsset(scriptOne)],
              }),
            }),
          }),
          createMockManifestEntry({
            browsers: ['chrome > 1'],
            manifest: createMockManifest({
              main: createMockEntrypoint({
                scripts: [createMockAsset(scriptTwo)],
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

function createMockAsset(path: string): Asset {
  return {path};
}

function createMockEntrypoint({
  scripts = [],
  styles = [],
}: {
  scripts?: Asset[];
  styles?: Asset[];
} = {}) {
  return {js: scripts, css: styles};
}

function createMockManifest(entrypoints: {[key: string]: Entrypoint} = {}) {
  return {entrypoints};
}

function createMockManifestEntry({
  name = 'bundle',
  browsers,
  manifest = createMockManifest({main: createMockEntrypoint()}),
}: Partial<ConsolidatedManifestEntry> = {}) {
  return {name, browsers, manifest};
}

function createMockConsolidatedManifest(
  manifests: ConsolidatedManifestEntry[] = [createMockManifestEntry()],
): ConsolidatedManifest {
  return manifests;
}
