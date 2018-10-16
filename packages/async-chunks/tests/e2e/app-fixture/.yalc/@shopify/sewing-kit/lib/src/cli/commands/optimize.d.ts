import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "optimize";
export declare const desc = "optimizes all SVG assets";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
}
export declare function handler(argv: Argv): Promise<void>;
