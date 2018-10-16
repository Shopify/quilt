import * as webpack from 'webpack';
import { Workspace } from '../../../workspace';
export { UglifyStrategy } from './optimization';
export declare function report({ env }: Workspace): any;
export declare function styles(workspace: Workspace, { sourceMap }: {
    sourceMap: boolean;
}): webpack.Plugin[];
export declare function watch({ env }: Workspace): webpack.Plugin[] | null;
export declare function manifests(workspace: Workspace): webpack.Plugin[];
export declare function output(workspace: Workspace): webpack.Plugin[];
export declare function input(): webpack.Plugin;
export declare function define({ env }: Workspace): webpack.Plugin;
export declare function startup({ config, paths, env, }: Workspace): webpack.Plugin | undefined;
export declare function lodash({ config, env, project, }: Workspace): webpack.Plugin[] | null;
export declare function chunkNaming({ env }: Workspace): webpack.Plugin[] | null;
