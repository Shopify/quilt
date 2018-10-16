import { Chunk } from '../../../../packages/webpack-asset-metadata-plugin';
export declare function removeHashes(paths: Chunk[]): string[];
export declare function runWebpack(fixture: string): Promise<void>;
export declare function opensslHash(path: string): string;
