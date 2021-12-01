import withEnv from '@shopify/with-env';

import Assets, {internalOnlyClearCache as clearAssetsCache} from '../assets';
import {Manifests} from '../manifests';

import {
  mockAsset,
  mockAsyncAsset,
  mockEntrypoint,
  mockManifest,
} from './test-utilities';

jest.mock('../manifests');

const ManifestsMock = Manifests as jest.Mock;
const resolvedManifestMock = jest.fn();

function setManifest(manifest) {
  resolvedManifestMock.mockReturnValue(Promise.resolve(manifest));
}

ManifestsMock.mockImplementation(
  jest.fn(() => {
    return {
      resolve: resolvedManifestMock,
    };
  }),
);

describe('Assets', () => {
  const defaultOptions = {assetPrefix: '/assets/'};

  beforeEach(() => {
    clearAssetsCache();
    resolvedManifestMock.mockReset();
  });

  afterEach(() => {});

  describe('scripts', () => {
    it('returns the main scripts by default', async () => {
      const js = '/style.js';

      setManifest(
        mockManifest({
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset(js)],
            }),
          },
        }),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts()).toStrictEqual([{path: js}]);
    });

    it('returns the scripts for a named bundle', async () => {
      const js = '/style.js';

      setManifest(
        Promise.resolve(
          mockManifest({
            entrypoints: {
              custom: mockEntrypoint({
                scripts: [mockAsset(js)],
              }),
            },
          }),
        ),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.scripts({name: 'custom'})).toStrictEqual([
        {path: js},
      ]);
    });

    it('prefixes async assets matching the passed IDs', async () => {
      const js = '/custom.js';
      const asyncJs = '/used.js';

      setManifest(
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
      );

      const assets = new Assets(defaultOptions);

      expect(
        await assets.scripts({name: 'custom', asyncAssets: ['used']}),
      ).toStrictEqual([{path: asyncJs}, {path: js}]);
    });

    it('throws an error when no scripts exist for the passed entrypoint', async () => {
      setManifest(
        mockManifest({
          entrypoints: {
            main: mockEntrypoint({
              scripts: [mockAsset('foo.js')],
            }),
          },
        }),
      );

      const assets = new Assets(defaultOptions);
      await expect(
        assets.scripts({name: 'non-existent'}),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('styles', () => {
    it('returns the main styles by default', async () => {
      const css = '/style.css';

      setManifest(
        mockManifest({
          entrypoints: {
            main: mockEntrypoint({
              styles: [mockAsset(css)],
            }),
          },
        }),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.styles()).toStrictEqual([{path: css}]);
    });

    it('returns the styles for a named bundle', async () => {
      const css = '/style.css';

      setManifest(
        mockManifest({
          entrypoints: {
            custom: mockEntrypoint({
              styles: [mockAsset(css)],
            }),
          },
        }),
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.styles({name: 'custom'})).toStrictEqual([
        {path: css},
      ]);
    });

    it('prefixes async assets matching the passed IDs', async () => {
      const css = '/custom.css';
      const asyncCss = '/used.css';

      setManifest(
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

      setManifest(
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

  describe('asyncAssets', () => {
    it('returns all async assets for the specified ids', async () => {
      const css = '/style.css';
      const asyncCss = '/mypage.css';
      const js = '/script.js';
      const asyncJs = 'mypage.js';

      setManifest(
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
      );

      const assets = new Assets(defaultOptions);

      expect(await assets.asyncAssets(['mypage'])).toStrictEqual([
        {path: asyncCss},
        {path: asyncJs},
      ]);
    });

    it('can omit specific types of assets on a per-id basis', async () => {
      const css = '/style.css';
      const asyncCss = '/mypage.css';
      const js = '/script.js';
      const asyncJs = 'mypage.js';

      setManifest(
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
      );

      const assets = new Assets(defaultOptions);

      expect(
        await assets.asyncAssets([{id: /mypage/, scripts: false}]),
      ).toStrictEqual([{path: asyncCss}]);
    });

    it('includes scripts even when omitted in development', async () => {
      const css = '/style.css';
      const asyncCss = '/mypage.css';
      const js = '/script.js';
      const asyncJs = 'mypage.js';

      setManifest(
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
      );

      const assets = new Assets(defaultOptions);

      expect(
        await withEnv('development', () =>
          assets.asyncAssets([{id: /mypage/, scripts: false}]),
        ),
      ).toStrictEqual([{path: asyncCss}, {path: asyncJs}]);
    });
  });
});
