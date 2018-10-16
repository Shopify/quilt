import { Workspace } from '../../../workspace';
export declare type UglifyStrategy = 'beautify' | 'off' | 'on';
export declare function optimization(workspace: Workspace, { sourceMaps, uglify }: {
    sourceMaps: boolean;
    uglify: UglifyStrategy;
}): {
    concatenateModules: boolean;
    minimize: boolean;
    minimizer: any[];
    namedChunks: boolean;
    namedModules: boolean;
    runtimeChunk: string;
    splitChunks: {
        chunks: string;
        maxAsyncRequests: number;
    };
} | {
    concatenateModules: boolean;
    minimize: boolean;
    namedChunks: boolean;
    namedModules: boolean;
    runtimeChunk: boolean;
    splitChunks: boolean;
    sideEffects: boolean;
} | null;
