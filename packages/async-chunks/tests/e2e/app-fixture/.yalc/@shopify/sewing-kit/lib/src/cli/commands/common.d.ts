import { Options } from 'yargs';
import { Verbosity } from '../../runner';
export declare const options: {
    [key: string]: Options;
};
export interface Options {
    config?: string;
    logLevel: Verbosity;
}
