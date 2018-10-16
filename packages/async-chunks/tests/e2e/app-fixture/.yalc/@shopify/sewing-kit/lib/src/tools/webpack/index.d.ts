import Runner from '../../runner';
import { Workspace } from '../../workspace';
import createConfig, { getServerBundle, SourceMapOptions } from './config';
import runDev from './dev';
import clean from './clean';
import manifest from './manifest';
import runPlayground from './playground';
export { createConfig, runDev, getServerBundle, clean, manifest, runPlayground };
export { runParallelWebpack, ParallelOptions } from './build-parallel';
export interface Options {
    clean: boolean;
    graphql: boolean;
    optimizeAssets: boolean;
    sourceMaps: SourceMapOptions;
    report: boolean;
    uglify: 'beautify' | 'off' | 'on';
    focus: string[];
}
export default function runWebpack(workspace: Workspace, options: Partial<Options> | undefined, runner: Runner): Promise<void>;
