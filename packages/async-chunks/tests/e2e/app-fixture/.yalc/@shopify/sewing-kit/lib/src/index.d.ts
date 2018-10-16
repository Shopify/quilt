import Env from './env';
import * as plugins from './plugins';
import { Plugin } from './types';
export { Env };
export { Plugin } from './types';
export declare type Plugins = typeof plugins;
export declare type ConfigurationCallback = (plugins: Plugins, env: Env) => {
    library?: boolean;
    name?: string;
    plugins: Plugin[];
};
