import { Workspace } from '../../workspace';
export declare function getFileTypeGlobs(options: {
    graphql?: boolean;
    json?: boolean;
    markdown?: boolean;
}): string | false;
export declare function prettierExecutable(workspace: Workspace): string;
