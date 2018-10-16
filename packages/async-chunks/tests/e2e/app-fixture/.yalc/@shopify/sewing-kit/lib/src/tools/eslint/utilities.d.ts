/// <reference types="node" />
import { ExecOptions } from 'child_process';
import Runner from '../../runner';
import { Workspace } from '../../workspace';
export declare function execESLint({ paths }: Workspace, runner: Runner, args: string, extensions?: string[], execOptions?: ExecOptions): Promise<void>;
