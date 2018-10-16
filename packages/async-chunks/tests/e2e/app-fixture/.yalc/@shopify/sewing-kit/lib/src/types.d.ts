/// <reference types="jest" />
import * as rollup from 'rollup';
export interface ProjectPaths {
    root: string;
    private: string;
    packages?: string;
    playground: string;
    nodeModules: string;
    app: string;
    components: string;
    sections: string;
    styles: string;
    build: string;
    cache: string;
    tests: string;
}
export interface Paths extends ProjectPaths {
    sewingKit: string;
    sewingKitNodeModules: string;
    defaultPostCSSConfig: string;
}
export interface CDNPlugin {
    plugin: 'cdn';
    url: string;
}
export interface EntryPlugin {
    plugin: 'entry';
    entries: string | string[] | {
        [key: string]: string | string[];
    };
}
export interface ExperimentsPlugin {
    plugin: 'experiments';
    fastStartup: boolean;
    optimizeLodash: boolean;
    railsWithNodeServer: boolean;
    asyncChunks: boolean;
}
export interface ExternalsPlugin {
    plugin: 'externals';
    externals: {
        [key: string]: string;
    };
}
export interface JestPlugin {
    plugin: 'jest';
    configure(config: jest.InitialOptions): jest.InitialOptions;
}
export interface GraphQLPlugin {
    plugin: 'graphql';
    schema: {
        production: string;
        development?: string;
    };
}
export interface ManifestPlugin {
    plugin: 'manifest';
    filename: string;
}
export interface AsyncChunksPlugin {
    plugin: 'asyncChunksManifest';
}
export interface PathsPlugin {
    plugin: 'paths';
    paths: Partial<ProjectPaths>;
}
export interface SassPlugin {
    plugin: 'sass';
    autoInclude: string[];
    autoImportPolaris: ('components' | 'global')[] | boolean;
}
export interface WebpackPlugin {
    plugin: 'webpack';
    configure(config: {
        [key: string]: any;
    }): object;
}
export interface VendorsPlugin {
    plugin: 'vendors';
    modules: string[];
}
export interface DevServerPlugin {
    plugin: 'devServer';
    port?: number;
    ip?: string;
}
export interface RollupPlugin {
    plugin: 'rollup';
    configure?: {
        input?(config: rollup.Options): rollup.Options;
        output?(config: rollup.WriteOptions): rollup.WriteOptions;
    };
}
export declare type Plugin = EntryPlugin | ExperimentsPlugin | ExternalsPlugin | CDNPlugin | GraphQLPlugin | ManifestPlugin | AsyncChunksPlugin | JestPlugin | PathsPlugin | SassPlugin | WebpackPlugin | VendorsPlugin | DevServerPlugin | RollupPlugin;
export interface PluginMap {
    cdn: CDNPlugin;
    entry: EntryPlugin;
    experiments: ExperimentsPlugin;
    externals: ExternalsPlugin;
    graphql: GraphQLPlugin;
    jest: JestPlugin;
    manifest: ManifestPlugin;
    asyncChunksManifest: AsyncChunksPlugin;
    paths: PathsPlugin;
    sass: SassPlugin;
    webpack: WebpackPlugin;
    vendors: VendorsPlugin;
    devServer: DevServerPlugin;
    rollup: RollupPlugin;
}
