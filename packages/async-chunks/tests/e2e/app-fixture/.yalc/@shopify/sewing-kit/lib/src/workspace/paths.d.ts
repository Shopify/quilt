import { Env } from '..';
import { Paths } from '../types';
import { Project } from './project';
import { Config } from './config';
export { Paths };
export default function loadPaths(root: string, env: Env, config: Config, project: Project): Paths;
