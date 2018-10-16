import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
import { Options as WebpackOptions } from '../../tools/webpack/config';
export declare const command = "dev";
export declare const desc = "starts a hot-reloading development server";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    hot: boolean;
    sourceMaps: WebpackOptions['sourceMaps'];
    lazy: boolean;
    debug: boolean;
    logReactUpdates: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
