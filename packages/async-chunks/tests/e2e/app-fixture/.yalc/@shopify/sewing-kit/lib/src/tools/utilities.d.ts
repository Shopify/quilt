import Runner from '../runner';
import { Workspace } from '../workspace';
export declare function projectSourceDirectories(workspace: Workspace): any[];
export declare function projectSourceDirectoryGlobPattern(workspace: Workspace): any;
export declare function getGraphQLConfig({ paths: { root } }: Workspace, runner: Runner): import("graphql-config/lib/GraphQLConfig").GraphQLConfig | null;
export declare function graphQLSchemaPath(workspace: Workspace, idl?: boolean): string;
export declare function appTypesPath({ paths: { app } }: Workspace): string;
export declare function graphQLSchemaTypesPath(workspace: Workspace): string;
export declare function makePrivateDirectory({ paths }: Workspace): Promise<void>;
export declare function makeGitIgnoredDirectory(path: string): Promise<void>;
export interface OpenFileOptions {
    line: number;
    column: number;
}
export declare function openFile(file: string, { line, column }?: Partial<OpenFileOptions>): Promise<void>;
