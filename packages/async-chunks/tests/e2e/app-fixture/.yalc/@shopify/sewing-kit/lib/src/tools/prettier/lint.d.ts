import Runner from '../../runner';
import { Workspace } from '../../workspace';
export interface PrettierLintOptions {
    graphql?: boolean;
    json?: boolean;
    markdown?: boolean;
    showExpected?: boolean;
}
export declare function runPrettierLint(workspace: Workspace, runner: Runner, options: PrettierLintOptions): Promise<void>;
