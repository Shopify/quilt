import * as webpack from 'webpack';
export interface Chunk {
    path: string;
    integrity?: string;
}
export interface Entrypoint {
    [key: string]: Chunk[];
}
export interface Entrypoints {
    [key: string]: Entrypoint;
}
export declare function getChunkDependencies({ entrypoints, outputOptions }: webpack.compilation.Compilation, entryName: string): Entrypoint;
