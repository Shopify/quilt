import Runner from '../../runner';
import { Workspace } from '../../workspace';
import { Options } from '.';
export declare const command = "start";
export declare const desc = "(Node only) - starts a local server in production mode";
export interface ParallelOptions extends Options {
    clientHeapSize?: number;
    serverHeapSize?: number;
}
export declare function runParallelWebpack(options: Partial<ParallelOptions>, runner: Runner, clientWorkspace: Workspace, serverWorkspace: Workspace): Promise<void>;
