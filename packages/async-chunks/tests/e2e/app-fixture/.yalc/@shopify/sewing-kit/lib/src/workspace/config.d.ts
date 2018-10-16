import { Plugin, PluginMap } from '../types';
import * as allPlugins from '../plugins';
import Env from '../env';
import { Project } from './project';
import Runner from '../runner';
export interface ProjectConfigBuilder {
    (plugins: typeof allPlugins, env: Env): {
        name?: string;
        plugins?: Plugin[];
    };
}
export interface ConfigOptions {
    name: string;
    plugins: Plugin[];
    library: boolean;
}
export declare class Config {
    name: string;
    plugins: Plugin[];
    library: boolean;
    constructor(name: string, plugins?: Plugin[], library?: boolean);
    for<T extends keyof PluginMap>(plugin: T): PluginMap[T] | undefined;
    for(plugin: 'experiments'): PluginMap['experiments'];
    readonly hash: any;
}
export default function loadConfig(configPath: string | undefined, env: Env, project: Project, runner: Runner): Promise<Config>;
