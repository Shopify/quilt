import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "manifest";
export declare const desc = "internal use only";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    target: 'client' | 'server';
    mode: 'development' | 'production' | 'staging' | 'test';
}
export declare function handler({ target, mode, ...options }: Argv): Promise<void>;
