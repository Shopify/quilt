// console.log for debugging ssr
/* eslint-disable no-console */
import {join} from 'path';

import {readJson} from 'fs-extra';
import appRoot from 'app-root-path';

import {Manifest} from './types';
import {Manifests} from './manifests';

export type {Asset} from './types';

interface Options {
  assetPrefix: string;
  userAgent?: string;
  manifestPath?: string;
}

interface AssetSelector {
  id: string | RegExp;
  styles?: boolean;
  scripts?: boolean;
}

interface AssetOptions {
  locale?: string;
  name?: string;
  asyncAssets?: Iterable<string | RegExp | AssetSelector>;
}

enum AssetKind {
  Styles = 'css',
  Scripts = 'js',
}

export default class Assets {
  assetPrefix: string;
  userAgent?: string;
  private manifests: Manifests;
  private resolvedManifestEntry?: Manifest;

  constructor({assetPrefix, userAgent, manifestPath}: Options) {
    this.assetPrefix = assetPrefix;
    this.userAgent = userAgent;
    this.manifests = new Manifests(manifestPath);
  }

  async scripts(options: AssetOptions = {}) {
    return getAssetsFromManifest(
      {...options, kind: AssetKind.Scripts},
      await this.getResolvedManifest(options.locale),
    );
  }

  async styles(options: AssetOptions = {}) {
    return getAssetsFromManifest(
      {...options, kind: AssetKind.Styles},
      await this.getResolvedManifest(options.locale),
    );
  }

  async assets(options: AssetOptions) {
    return getAssetsFromManifest(
      options,
      await this.getResolvedManifest(options.locale),
    );
  }

  async asyncAssets(
    ids: Iterable<string | RegExp | AssetSelector>,
    locale?: string,
  ) {
    return getAsyncAssetsFromManifest(
      ids,
      await this.getResolvedManifest(locale),
    );
  }

  async graphQLSource(id: string) {
    const graphQLManifest = await loadGraphQLManifest();
    return graphQLManifest.get(id) || null;
  }

  private async getResolvedManifestEntry(
    locale: string | undefined,
  ): Promise<Manifest> {
    if (this.resolvedManifestEntry) {
      return this.resolvedManifestEntry;
    }

    const {userAgent} = this;
    const manifest = await this.manifests.resolve(userAgent, {
      locale,
    });

    this.resolvedManifestEntry = manifest;
    return manifest;
  }

  private async getResolvedManifest(
    locale: string | undefined,
  ): Promise<Manifest> {
    const manifest = await this.getResolvedManifestEntry(locale);
    return manifest;
  }
}

let graphQLManifestPromise: Promise<Map<string, string>> | null = null;

function loadGraphQLManifest() {
  if (graphQLManifestPromise) {
    return graphQLManifestPromise;
  }

  graphQLManifestPromise = readJson(
    join(appRoot.path, 'build/client/graphql.json'),
  ).then((result) => new Map<string, string>(Object.entries(result)));

  return graphQLManifestPromise;
}

export function internalOnlyClearCache() {
  graphQLManifestPromise = null;
}

function getAssetsFromManifest(
  {
    name = 'main',
    asyncAssets: asyncIds,
    kind,
  }: AssetOptions & {kind?: AssetKind},
  manifest: Manifest,
) {
  const {entrypoints} = manifest;

  if (!Object.prototype.hasOwnProperty.call(entrypoints, name)) {
    const entries = Object.keys(entrypoints);
    const guidance =
      entries.length === 0
        ? 'No entrypoints exist.'
        : `No entrypoints found with the name '${name}'. Available entrypoints: ${entries.join(
            ', ',
          )}`;

    throw new Error(guidance);
  }

  const entrypoint = entrypoints[name];
  const entrypointAssets =
    kind == null
      ? [...entrypoint[AssetKind.Styles], ...entrypoint[AssetKind.Scripts]]
      : [...entrypoints[name][kind]];

  const asyncAssets = asyncIds
    ? getAsyncAssetsFromManifest(asyncIds, manifest, {kind})
    : [];

  if (asyncAssets.length === 0) {
    return entrypointAssets;
  }

  const bundleTester = new RegExp(`\\b${name}[^\\.]*\\.${kind}`);

  const nonVendorEntrypointIndex = entrypointAssets.findIndex((bundle) =>
    bundleTester.test(bundle.path),
  );

  if (nonVendorEntrypointIndex) {
    entrypointAssets.splice(nonVendorEntrypointIndex, 0, ...asyncAssets);
    return entrypointAssets;
  }

  return [...asyncAssets, ...entrypointAssets];
}

function getAsyncAssetsFromManifest(
  ids: Iterable<string | RegExp | AssetSelector>,
  manifest: Manifest,
  {kind}: {kind?: AssetKind} = {},
) {
  return [...ids]
    .reduce((all, id) => {
      const assetsMatchingId = isAssetSelector(id)
        ? getAsyncAssetsById(id.id, manifest)
        : getAsyncAssetsById(id, manifest);

      console.log({
        'reduce id': id,
        'typeof id': typeof id,
        assetsMatchingId,
        'typeof assetsMatchingId': typeof assetsMatchingId,
      });
      const normalizedKind =
        kind || (isAssetSelector(id) && kindFromAssetSelector(id)) || null;
      console.log('normalizedKind', normalizedKind);
      console.log('typeof normalizedKind', typeof normalizedKind);

      const filteredMatchingAssets =
        normalizedKind == null
          ? assetsMatchingId
          : assetsMatchingId.filter(({file}) =>
              file.endsWith(`.${normalizedKind}`),
            );

      return [...all, ...filteredMatchingAssets];
    }, [])
    .map(({publicPath}) => ({path: publicPath}));
}

function getAsyncAssetsById(id: string | RegExp, {asyncAssets}: Manifest) {
  return typeof id === 'string'
    ? asyncAssets[id]
    : Object.entries(asyncAssets).reduce(
        (all, [asyncId, assets]) =>
          id.test(asyncId) ? [...all, ...assets] : all,
        [],
      );
}

function kindFromAssetSelector({styles = true, scripts = true}: AssetSelector) {
  // In development, styles are included as part of the JS bundles. Asking
  // for only styles in that environment therefore equates to asking for
  // both.
  // eslint-disable-next-line no-process-env
  const forceIncludeAll = styles && process.env.NODE_ENV === 'development';

  if ((styles && scripts) || forceIncludeAll) {
    return null;
  } else if (styles) {
    return AssetKind.Styles;
  } else {
    return AssetKind.Scripts;
  }
}

function isAssetSelector(selector: unknown): selector is AssetSelector {
  console.log({
    'selector:': selector,
    'typeof selector:': typeof selector,
  });
  return typeof selector === 'object' && selector != null && 'id' in selector;
}
