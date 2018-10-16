import Runner from '../../runner';
import { Workspace } from '../../workspace';
export { default as runGraphQLLint } from './graphql';
export interface ESLintOptions {
    runFixer?: boolean;
}
export default function runESLint(workspace: Workspace, runner: Runner, options?: ESLintOptions): Promise<void>;
