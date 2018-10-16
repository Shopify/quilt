import { Options } from 'yargs';
import { Options as CommonOptions } from './common';
export declare const command = "generate <component>";
export declare const desc = "generates boilerplate for new React components";
export declare const builder: {
    [key: string]: Options;
};
export interface Argv extends CommonOptions {
    component: string;
}
export declare function handler({ component, ...options }: Argv): Promise<void>;
