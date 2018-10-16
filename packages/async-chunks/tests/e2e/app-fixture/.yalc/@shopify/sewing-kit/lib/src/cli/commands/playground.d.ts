import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "playground [gist]";
export declare const desc = "starts a rapid prototyping sandbox";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    gist?: string;
    force?: boolean;
}
export declare function handler({ gist, force, ...options }: Argv): Promise<void>;
