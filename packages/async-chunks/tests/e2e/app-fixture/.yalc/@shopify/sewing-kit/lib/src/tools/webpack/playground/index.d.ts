import Runner from '../../../runner';
import { Workspace } from '../../../workspace';
export interface Options {
    gist: string;
    force: boolean;
}
export default function runPlayground(workspace: Workspace, { gist, force }: Partial<Options> | undefined, runner: Runner): Promise<void>;
