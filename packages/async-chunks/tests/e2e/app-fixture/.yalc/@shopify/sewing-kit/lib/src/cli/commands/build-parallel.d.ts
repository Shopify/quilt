import { Options as YargsOption } from 'yargs';
import { Options } from '../../tools/webpack';
import { Options as CommonOptions } from './common';
export declare const command = "build-parallel";
export declare const desc: boolean;
export declare const builder: {
    [key: string]: YargsOption;
};
export interface Argv extends Options, CommonOptions {
}
export declare function handler({ ...options }: Argv): Promise<void>;
