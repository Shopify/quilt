import Runner from '../../../../runner';
import { Workspace } from '../../../../workspace';
export { cleanVendorDLL as clean } from './clean';
export declare function getVendorModules(workspace: Workspace): string[];
export declare function hasVendorDLL(workspace: Workspace): boolean;
export declare function vendorDLLManifestPath(workspace: Workspace): string;
export default function buildVendorDLL(workspace: Workspace, runner: Runner): Promise<void>;
export declare function isVendorDLLUpToDate(workspace: Workspace, runner: Runner): Promise<boolean>;
