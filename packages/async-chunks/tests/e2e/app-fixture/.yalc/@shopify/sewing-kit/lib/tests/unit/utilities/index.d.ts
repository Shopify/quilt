/// <reference types="jest" />
/// <reference types="node" />
import { Workspace, Paths } from '../../../src/workspace';
import Env from '../../../src/env';
import { Plugin } from '../../../src/types';
export interface Options {
    root: string;
    isRails: boolean;
    hasPostCSSConfig: boolean;
    hasProcfile: boolean;
    dependencies: {
        [key: string]: string;
    };
    devDependencies: {
        [key: string]: string;
    };
    devYaml: {
        [key: string]: any;
    } | false;
    railgunYaml: {
        [key: string]: any;
    } | false;
    plugins: Plugin[];
    paths: Partial<Paths>;
    env: Env;
    nodeModulesHash: string;
}
export declare function createWorkspace({ root, isRails, hasPostCSSConfig, hasProcfile, dependencies, devDependencies, devYaml, railgunYaml, plugins, paths, env, nodeModulesHash, }?: Partial<Options>): Workspace;
export declare function createDependency(name: string, version?: string): {
    [x: string]: string;
};
export interface CommandDescription {
    executable: string;
    positionalArgs: string[];
    [key: string]: any;
}
export declare function parseCommand(command: string): CommandDescription;
export declare function withTempFixture(fixtureDir: string, callback: (dir: string) => any | Promise<any>): jest.ProvidesCallback;
export declare function withTempDir(name: string, callback: (dir: string) => any | Promise<any>): Promise<void>;
export declare function stripString(dir: string, callArgs: any): typeof callArgs;
export declare function withEnv<T>(overrides: NodeJS.ProcessEnv, callback: () => T): T;
export { FakeRunner } from './fake-runner';
