import {basename} from 'path';

import {Asset, AsyncAsset, ConsolidatedManifest, Manifest} from '../types';

export function mockAsset(path: string): Asset {
  return {path};
}

export function mockAsyncAsset(path: string): AsyncAsset {
  return {publicPath: path, file: basename(path)};
}

export function mockEntrypoint({
  scripts = [],
  styles = [],
}: {
  scripts?: Asset[];
  styles?: Asset[];
} = {}) {
  return {js: scripts, css: styles};
}

export function mockManifest({
  identifier = undefined,
  name = 'mockedManifest',
  browsers,
  entrypoints = {},
  asyncAssets = {},
}: Partial<Manifest>): Manifest {
  return {
    identifier,
    name,
    browsers,
    entrypoints,
    asyncAssets,
  };
}

export function mockConsolidatedManifest(
  manifests: Manifest[],
): ConsolidatedManifest {
  return manifests;
}
