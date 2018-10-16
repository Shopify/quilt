import { Options as YargsOption } from 'yargs';
import { Options } from '../../tools/webpack';
import { Options as CommonOptions } from './common';
export declare const command = "build";
export declare const desc = "compiles code and SCSS into deployable assets";
export declare const builder: {
    [key: string]: YargsOption;
};
export interface Argv extends Options, CommonOptions {
    mode: 'development' | 'production' | 'staging' | 'test';
    clientOnly?: boolean;
    serverOnly?: boolean;
}
export declare function handler({ mode, ...options }: Argv): Promise<void>;
