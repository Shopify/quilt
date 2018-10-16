import Runner from '../../runner';
import { Workspace } from '../../workspace';
export declare const TS_INDEX_WITHOUT_TS: string;
export default function verifyTypescript(workspace: Workspace, runner: Runner): Promise<void>;
export declare function noTSConfig(root: string): Error;
