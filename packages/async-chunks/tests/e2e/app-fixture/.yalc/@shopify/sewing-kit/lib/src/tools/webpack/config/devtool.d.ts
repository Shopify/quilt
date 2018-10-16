import { Workspace } from '../../../workspace';
export declare type SourceMapOptions = 'accurate' | 'fast' | 'off';
export declare function devtool({ env, project }: Workspace, { sourceMaps }: {
    sourceMaps: SourceMapOptions;
}): string | undefined;
