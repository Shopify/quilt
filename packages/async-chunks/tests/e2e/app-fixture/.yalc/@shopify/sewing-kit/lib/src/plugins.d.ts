import { SassPlugin, WebpackPlugin, JestPlugin, ManifestPlugin, PathsPlugin, GraphQLPlugin, CDNPlugin, EntryPlugin, ExperimentsPlugin, ExternalsPlugin, VendorsPlugin, DevServerPlugin, RollupPlugin } from './types';
export declare function cdn(url: string): CDNPlugin;
export declare function entry(entries: EntryPlugin['entries']): EntryPlugin;
export declare function experiments({ fastStartup, optimizeLodash, railsWithNodeServer, asyncChunks, }: Partial<ExperimentsPlugin>): ExperimentsPlugin;
export declare type ExternalsPluginConfig = ExternalsPlugin['externals'];
export declare function externals(externals: ExternalsPluginConfig): ExternalsPlugin;
export interface GraphQLPluginConfig {
    schema: GraphQLPlugin['schema'] | string;
}
export declare function graphql({ schema }: GraphQLPluginConfig): GraphQLPlugin;
export declare function jest(configure: JestPlugin['configure']): JestPlugin;
export declare function manifest(filename: string): ManifestPlugin;
export declare function paths(paths: PathsPlugin['paths']): PathsPlugin;
export interface SassPluginConfig {
    autoInclude?: SassPlugin['autoInclude'];
    autoImportPolaris?: SassPlugin['autoImportPolaris'];
}
export declare function sass({ autoInclude, autoImportPolaris, }: SassPluginConfig): SassPlugin;
export declare function webpack(configure: WebpackPlugin['configure']): WebpackPlugin;
export declare function vendors(modules: string[]): VendorsPlugin;
export declare function devServer(options: Partial<DevServerPlugin>): DevServerPlugin;
export declare function rollup(configure?: RollupPlugin['configure']): {
    plugin: string;
    configure: {} | undefined;
};
