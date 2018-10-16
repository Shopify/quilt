import Runner from '../../runner';
import { Workspace } from '../../workspace';
import createConfig, { Options as ConfigOptions } from './config';
export interface Options extends ConfigOptions {
    watch: boolean;
    cacheDirectory: string | undefined;
    debug: boolean;
    maxWorkers: number | undefined;
    testRegex: string;
    updateSnapshot: boolean;
    coverage: boolean;
}
export { createConfig };
export default function runJest(workspace: Workspace, { watch, cacheDirectory, debug, updateSnapshot, testRegex, coverage, maxWorkers, ...options }: Partial<Options>, runner: Runner): Promise<void>;
