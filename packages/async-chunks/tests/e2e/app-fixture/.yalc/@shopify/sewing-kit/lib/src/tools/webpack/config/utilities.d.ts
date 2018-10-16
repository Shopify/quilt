import { Configuration } from 'webpack';
import { Workspace } from '../../../workspace';
export declare const HASH_FUNCTION = "sha256";
export declare const HASH_DIGEST_LENGTH = 64;
export declare function buildDir({ project, env, paths }: Workspace): string;
export declare function getServerBundle({ output, entry }: Configuration): string;
export declare function getManifestPath(workspace: Workspace): string;
export declare const sassIncludePaths: any;
export declare const sassGlobalsLoader: any;
