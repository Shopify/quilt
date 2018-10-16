import * as webpack from 'webpack';
export interface ManifestEntry {
    [key: string]: string;
}
export interface Manifest {
    [key: string]: ManifestEntry;
}
export declare function getAssetManifest(assetBasePath: string, compilation: webpack.compilation.Compilation): Manifest;
