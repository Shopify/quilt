import Runner from '../../runner';
import { Workspace } from '../../workspace';
import clean from './clean';
export { clean };
export default function buildGraphQL(workspace: Workspace, runner: Runner): Promise<void>;
