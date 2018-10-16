import { Workspace } from '../../../workspace';
export interface Options {
    vscodeDebug: boolean;
}
export default function output(workspace: Workspace, { vscodeDebug }: Options): object;
