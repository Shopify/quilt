import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "test [test-regex]";
export declare const desc = "runs all tests";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    testRegex?: string;
    watch?: boolean;
    cacheDirectory?: string;
    debug: boolean;
    maxWorkers?: number;
    updateSnapshot?: boolean;
    coverage?: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
