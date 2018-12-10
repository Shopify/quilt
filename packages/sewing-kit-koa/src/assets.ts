import {join} from 'path';
import {readJson} from 'fs-extra';
import appRoot from 'app-root-path';

export interface Asset {
  path: string;
  integrity?: string;
}

interface Entrypoint {
  js: Asset[];
  css: Asset[];
}

interface AssetList {
  entrypoints: {[key: string]: Entrypoint};
}

interface Options {
  assetHost: string;
}

export default class Assets {
  assetHost: string;
  private resolvedAssetList?: AssetList;

  constructor({assetHost}: Options) {
    this.assetHost = assetHost;
  }

  async scripts({name = 'main'} = {}) {
    const {js} = getAssetsForEntrypoint(name, await this.getAssetList());

    const scripts =
      // Sewing Kit does not currently include the vendor DLL in its asset
      // manifest, so we manually add it here (it only exists in dev).
      // eslint-disable-next-line no-process-env
      process.env.NODE_ENV === 'development'
        ? [{path: `${this.assetHost}dll/vendor.js`}, ...js]
        : js;

    return scripts;
  }

  async styles({name = 'main'} = {}) {
    const {css} = getAssetsForEntrypoint(name, await this.getAssetList());
    return css;
  }

  private async getAssetList() {
    if (this.resolvedAssetList) {
      return this.resolvedAssetList;
    }

    this.resolvedAssetList = await loadConsolidatedManifest();
    return this.resolvedAssetList;
  }
}

let consolidatedManifestPromise: Promise<AssetList> | null = null;

function loadConsolidatedManifest() {
  if (consolidatedManifestPromise) {
    return consolidatedManifestPromise;
  }

  consolidatedManifestPromise = readJson(
    join(appRoot.path, 'build/client/assets.json'),
  );

  return consolidatedManifestPromise;
}

export function internalOnlyClearCache() {
  consolidatedManifestPromise = null;
}

function getAssetsForEntrypoint(name: string, {entrypoints}: AssetList) {
  if (!entrypoints.hasOwnProperty(name)) {
    throw new Error(
      `No entrypoints found with the name '${name}'. Available entrypoints: ${Object.keys(
        entrypoints,
      ).join(', ')}`,
    );
  }

  return entrypoints[name];
}
