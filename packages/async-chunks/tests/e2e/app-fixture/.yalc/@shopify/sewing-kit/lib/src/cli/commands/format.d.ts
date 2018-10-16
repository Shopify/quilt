import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "format";
export declare const desc = "formats files using Prettier";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    graphql?: boolean;
    json?: boolean;
    markdown?: boolean;
    scripts?: boolean;
    styles?: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
