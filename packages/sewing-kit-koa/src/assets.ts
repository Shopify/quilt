import {join} from 'path';
import {readJson} from 'fs-extra';
import {matchesUA} from 'browserslist-useragent';
import appRoot from 'app-root-path';

export interface Asset {
  path: string;
  integrity?: string;
}

export interface Entrypoint {
  js: Asset[];
  css: Asset[];
}

export interface AsyncAsset {
  id?: string;
  file: string;
  publicPath: string;
  integrity?: string;
}

export interface Manifest {
  name?: string;
  browsers?: string[];
  entrypoints: {[key: string]: Entrypoint};
  asyncAssets: {[key: string]: AsyncAsset[]};
}

export type ConsolidatedManifest = Manifest[];

interface Options {
  assetPrefix: string;
  userAgent?: string;
}

interface AssetSelector {
  id: string | RegExp;
  styles?: boolean;
  scripts?: boolean;
}

interface AssetOptions {
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
  private resolvedManifestEntry?: Manifest;

  constructor({assetPrefix, userAgent}: Options) {
    this.assetPrefix = assetPrefix;
    this.userAgent = userAgent;
  }

  async scripts(options: AssetOptions = {}) {
    const js = getAssetsFromManifest(
      {...options, kind: AssetKind.Scripts},
      await this.getResolvedManifest(),
    );

    const scripts =
      // Sewing Kit does not currently include the vendor DLL in its asset
      // manifest, so we manually add it here (it only exists in dev).
      // eslint-disable-next-line no-process-env
      process.env.NODE_ENV === 'development'
        ? [{path: `${this.assetPrefix}dll/vendor.js`}, ...js]
        : js;

    return scripts;
  }

  async styles(options: AssetOptions = {}) {
    return getAssetsFromManifest(
      {...options, kind: AssetKind.Styles},
      await this.getResolvedManifest(),
    );
  }

  async assets(options: AssetOptions) {
    return getAssetsFromManifest(options, await this.getResolvedManifest());
  }

  async asyncAssets(ids: Iterable<string | RegExp | AssetSelector>) {
    return getAsyncAssetsFromManifest(ids, await this.getResolvedManifest());
  }

  async graphQLSource(id: string) {
    const graphQLManifest = await loadGraphQLManifest();
    return graphQLManifest.get(id) || null;
  }

  private async getResolvedManifestEntry() {
    if (this.resolvedManifestEntry) {
      return this.resolvedManifestEntry;
    }

    const consolidatedManifest = await loadConsolidatedManifest();
    const {userAgent} = this;

    const lastManifestEntry =
      consolidatedManifest[consolidatedManifest.length - 1];

    // We do the following to determine the correct manifest to use:
    //
    // 1. If there is no user agent, use the "last" manifest, which is the
    // least restrictive set of browsers.
    // 2. If there is only one manifest, use it, regardless of how well it
    // matches the user agent.
    // 3. If there is a user agent, find the first manifest where the
    // browsers it was compiled for matches the user agent, or where there
    // is no browser restriction on the bundle.
    // 4. If no matching manifests are found, fall back to the last manifest.
    if (userAgent == null || consolidatedManifest.length === 1) {
      this.resolvedManifestEntry = lastManifestEntry;
    } else {
      this.resolvedManifestEntry =
        consolidatedManifest.find(
          ({browsers}) =>
            browsers == null ||
            matchesUA(userAgent, {
              browsers,
              ignoreMinor: true,
              ignorePatch: true,
              allowHigherVersions: true,
            }),
        ) || lastManifestEntry;
    }

    return this.resolvedManifestEntry;
  }

  private async getResolvedManifest(): Promise<Manifest> {
    const manifest = await this.getResolvedManifestEntry();
    return manifest;
  }
}

let consolidatedManifestPromise: Promise<ConsolidatedManifest> | null = null;
let graphQLManifestPromise: Promise<Map<string, string>> | null = null;

function loadConsolidatedManifest() {
  if (consolidatedManifestPromise) {
    return consolidatedManifestPromise;
  }

  consolidatedManifestPromise = readJson(
    join(appRoot.path, 'build/client/assets.json'),
  );

  return consolidatedManifestPromise;
}

function loadGraphQLManifest() {
  if (graphQLManifestPromise) {
    return graphQLManifestPromise;
  }

  graphQLManifestPromise = readJson(
    join(appRoot.path, 'build/client/graphql.json'),
  ).then(result => new Map<string, string>(Object.entries(result)));

  return graphQLManifestPromise;
}

export function internalOnlyClearCache() {
  consolidatedManifestPromise = null;
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

  if (!entrypoints.hasOwnProperty(name)) {
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

  const nonVendorEntrypointIndex = entrypointAssets.findIndex(bundle =>
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

      const normalizedKind =
        kind || (isAssetSelector(id) && kindFromAssetSelector(id)) || null;

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
  return typeof selector === 'object' && selector != null && 'id' in selector;
}
