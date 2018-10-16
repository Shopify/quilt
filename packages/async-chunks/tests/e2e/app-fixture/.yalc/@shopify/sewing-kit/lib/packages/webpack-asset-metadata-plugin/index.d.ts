import * as webpack from 'webpack';
import { Manifest } from './manifest';
import { Entrypoints, Entrypoint, Chunk } from './entrypoints';
export interface Options {
    filename: string;
    assetBasePath: string | false;
}
export interface AssetMetadata {
    assets: Manifest;
    entrypoints: Entrypoints;
}
export { Chunk, Entrypoint };
export declare class AssetMetadataPlugin implements webpack.Plugin {
    private options;
    constructor(options?: Partial<Options>);
    apply(compiler: webpack.Compiler): void;
}
