import * as webpack from 'webpack';
import * as _formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import Runner from '../../runner';
import { Workspace } from '../../workspace';
export declare function getHMRPath(publicPath: string): string;
export declare function addHMRConfig({ project }: Workspace, config: any): void;
export declare type EntryList = string | string[];
export interface EntryObject {
    [key: string]: EntryList;
}
export declare type Entry = EntryList | EntryObject;
export declare function prependToEntries(entry: Entry, entryModule: string): Entry;
export declare function addVendorToEntries(entries: Entry, vendor: string | string[]): Entry;
export interface LogStatsOptions {
    name: string;
    onlyErrors?: boolean;
    matchingStats?: webpack.Stats | null;
}
export declare function formatWebpackMessages(stats: webpack.Stats, loggedStats?: webpack.Stats | null): _formatWebpackMessages.WebpackJSON;
export declare function compileTime(stats: webpack.Stats): string;
export declare function logStats({ logger }: Runner, stats: webpack.Stats, { name, onlyErrors, matchingStats }: LogStatsOptions): void;
