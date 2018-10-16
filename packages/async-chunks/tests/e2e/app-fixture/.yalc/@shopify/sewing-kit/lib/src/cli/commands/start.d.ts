import { Options as YargsOption } from 'yargs';
import { ParallelOptions } from '../../tools/webpack';
import { Options as CommonOptions } from './common';
export declare const command = "start";
export declare const desc = "(Node only) - starts a local server in production mode";
export declare const builder: {
    [key: string]: YargsOption;
};
export interface Argv extends ParallelOptions, CommonOptions {
    assetServerOnly?: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
