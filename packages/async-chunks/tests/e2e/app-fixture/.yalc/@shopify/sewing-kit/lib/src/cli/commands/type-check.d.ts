import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "type-check";
export declare const desc = "checks TypeScript files for type violations";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    watch?: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
