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
  identifier?: {locales?: string[]; target?: string};
  name?: string;
  browsers?: string[];
  entrypoints: {[key: string]: Entrypoint};
  asyncAssets: {[key: string]: AsyncAsset[]};
}

export type ConsolidatedManifest = Manifest[];
