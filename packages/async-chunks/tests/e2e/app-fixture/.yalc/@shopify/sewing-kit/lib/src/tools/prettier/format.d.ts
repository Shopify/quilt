import Runner from '../../runner';
import { Workspace } from '../../workspace';
export interface PrettierFormatOptions {
    graphql?: boolean;
    json?: boolean;
    markdown?: boolean;
    showExpected?: boolean;
}
export declare function runPrettierFormat(workspace: Workspace, runner: Runner, options: PrettierFormatOptions): Promise<void>;
