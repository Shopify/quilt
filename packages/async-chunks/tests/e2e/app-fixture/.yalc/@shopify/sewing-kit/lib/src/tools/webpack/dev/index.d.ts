import { Workspace } from '../../../workspace';
import Runner from '../../../runner';
import { SourceMapOptions } from '../config/devtool';
import { Options as ClientOptions } from './client';
import { Options as ServerOptions } from './server';
export interface Options extends ClientOptions, ServerOptions {
    sourceMaps: SourceMapOptions;
    focus: string[];
}
export default function runDev(workspace: Workspace, { hot, sourceMaps, lazy, debug, logReactUpdates, focus, }: Partial<Options>, runner: Runner): Promise<void>;
