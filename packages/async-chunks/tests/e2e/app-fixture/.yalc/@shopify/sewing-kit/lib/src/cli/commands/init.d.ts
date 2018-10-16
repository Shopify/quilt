import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "init";
export declare const desc = "creates config files for tools";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    prettierignore?: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
