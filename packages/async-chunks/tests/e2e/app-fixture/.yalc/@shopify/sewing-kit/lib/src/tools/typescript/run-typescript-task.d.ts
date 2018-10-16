import Runner from '../../runner';
import { Workspace } from '../../workspace';
export default function runTypeScript(workspace: Workspace, runner: Runner, { watch }?: {
    watch?: boolean;
}): Promise<void>;
