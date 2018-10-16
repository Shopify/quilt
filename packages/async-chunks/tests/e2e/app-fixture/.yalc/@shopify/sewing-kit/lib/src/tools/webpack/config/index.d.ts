import { Workspace } from '../../../workspace';
import { SourceMapOptions } from './devtool';
import { getServerBundle, getManifestPath } from './utilities';
import { UglifyStrategy } from './plugins';
export { SourceMapOptions };
export interface Options {
    sourceMaps: SourceMapOptions;
    report: boolean;
    uglify: UglifyStrategy;
    vscodeDebug: boolean;
    focus: string[];
}
export interface Config {
    [key: string]: any;
}
export { getServerBundle, getManifestPath };
export default function webpackConfig(workspace: Workspace, { sourceMaps, report: buildReport, vscodeDebug, uglify, focus: sections, }?: Partial<Options>): Promise<Config>;
