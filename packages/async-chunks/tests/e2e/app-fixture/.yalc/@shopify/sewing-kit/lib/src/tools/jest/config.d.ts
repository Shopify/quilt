import { Workspace } from '../../workspace';
export interface Options {
    testDirectories: string[];
}
export interface Config {
    [key: string]: any;
}
export default function jestConfig(workspace: Workspace, { testDirectories }?: Partial<Options>): Promise<Config>;
