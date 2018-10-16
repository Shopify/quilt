import Runner from '../../runner';
import { Workspace } from '../../workspace';
export interface StylelintOptions {
    runFixer?: boolean;
}
export default function runStylelint(workspace: Workspace, runner: Runner, options?: StylelintOptions): Promise<void>;
