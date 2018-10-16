import Runner from '../../runner';
import { Workspace } from '../../workspace';
import clean from './clean';
export { clean };
export interface Options {
    watch: boolean;
}
export default function buildGraphQLTypeScriptDefinitions(workspace: Workspace, { watch }: Partial<Options>, runner: Runner): Promise<void>;
