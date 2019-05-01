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
  entrypoints: {[key: string]: Entrypoint};
  asyncAssets: {[key: string]: AsyncAsset[]};
}

export interface ConsolidatedManifestEntry {
  name: string;
  browsers?: string[];
  manifest: Manifest;
}

export type ConsolidatedManifest = ConsolidatedManifestEntry[];

interface Options {
  assetPrefix: string;
  userAgent?: string;
}

interface AsyncAssetOptions {
  id: string | RegExp | Iterable<string | RegExp>;
}

interface AssetOptions {
  name?: string;
  asyncAssets?: AsyncAssetOptions['id'];
}

enum AssetKind {
  Styles = 'css',
  Scripts = 'js',
}

export default class Assets {
  assetPrefix: string;
  userAgent?: string;
  private resolvedManifestEntry?: ConsolidatedManifestEntry;

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

  async asyncScripts({id}: AsyncAssetOptions) {
    return getAsyncAssetsFromManifest(
      {id, kind: AssetKind.Scripts},
      await this.getResolvedManifest(),
    );
  }

  async styles(options: AssetOptions = {}) {
    return getAssetsFromManifest(
      {...options, kind: AssetKind.Styles},
      await this.getResolvedManifest(),
    );
  }

  async asyncStyles({id}: AsyncAssetOptions) {
    return getAsyncAssetsFromManifest(
      {id, kind: AssetKind.Styles},
      await this.getResolvedManifest(),
    );
  }

  async assets(options: AssetOptions) {
    return getAssetsFromManifest(options, await this.getResolvedManifest());
  }

  async asyncAssets(options: AsyncAssetOptions) {
    return getAsyncAssetsFromManifest(
      options,
      await this.getResolvedManifest(),
    );
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

  private async getResolvedManifest() {
    return (await this.getResolvedManifestEntry()).manifest;
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
    ? getAsyncAssetsFromManifest({id: asyncIds, kind}, manifest)
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
  {id, kind}: AsyncAssetOptions & {kind?: AssetKind},
  {asyncAssets}: Manifest,
) {
  const normalizedIds =
    typeof id === 'string' || id instanceof RegExp ? [id] : id;

  const asyncEntries = Object.entries(asyncAssets);

  return [...normalizedIds]
    .reduce((all, id) => {
      const assetsMatchingId =
        typeof id === 'string'
          ? asyncAssets[id]
          : asyncEntries.reduce(
              (all, [asyncId, assets]) =>
                id.test(asyncId) ? [...all, ...assets] : all,
              [],
            );

      const filteredMatchingAssets =
        kind == null
          ? assetsMatchingId
          : assetsMatchingId.filter(({file}) => file.endsWith(`.${kind}`));

      return [...all, ...filteredMatchingAssets];
    }, [])
    .map(({publicPath}) => ({path: publicPath}));
}
