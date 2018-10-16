import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "check";
export declare const desc = "runs all lint checks and tests";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    build: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
