import { Options as YargsOption } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "refresh-graphql";
export declare const desc = "fetches and processes GraphQL assets";
export interface Argv extends CommonOptions {
    definitions?: boolean;
}
export declare const builder: {
    [key: string]: YargsOption;
};
export declare function handler({ definitions, ...options }: Argv): Promise<void>;
