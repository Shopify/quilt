import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "lint";
export declare const desc = "lints Sass, JSON, JavaScript, TypeScript, and GraphQL files";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    graphql?: boolean;
    graphqlFixtures?: boolean;
    json?: boolean;
    markdown?: boolean;
    styles?: boolean;
    scripts?: boolean;
    showExpected?: boolean;
}
export declare function handler(argv: Argv): Promise<void>;
