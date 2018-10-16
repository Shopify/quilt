import Env from '../env';
import Runner from '../runner';
import { Config } from './config';
import { Project } from './project';
import { Paths } from './paths';
export { Config, Project, Paths };
export interface Options {
    config?: string;
}
export declare class Workspace {
    root: string;
    env: Env;
    project: Project;
    paths: Paths;
    config: Config;
    readonly name: string;
    constructor(root: string, env: Env, project: Project, paths: Paths, config: Config);
    duplicate(env?: Env): Workspace;
}
export default function loadWorkspace(env: Env | undefined, runner: Runner, { config: configPath }?: Options): Promise<Workspace>;
