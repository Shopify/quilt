import Runner from '../../runner';
import { Workspace } from '../../workspace';
export interface RunValidateGraphQLFixturesOptions {
    showPasses?: boolean;
}
export default function runValidateGraphQLFixtures(workspace: Workspace, runner: Runner, options?: RunValidateGraphQLFixturesOptions): Promise<void>;
