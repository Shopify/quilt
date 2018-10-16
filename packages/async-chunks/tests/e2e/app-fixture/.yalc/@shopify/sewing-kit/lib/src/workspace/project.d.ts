export interface PackageJSON {
    dependencies: {
        [key: string]: string;
    };
    devDependencies: {
        [key: string]: string;
    };
}
export interface DevYaml {
}
export interface RailgunHostnameWithProxy {
    [key: string]: {
        proxy_to_host_port: number;
    };
}
export declare type RailgunHostnameConfig = RailgunHostnameWithProxy | string;
export interface RailgunYaml {
    hostnames?: RailgunHostnameConfig[];
}
export declare class Project {
    isRails: boolean;
    private packageJSON;
    readonly nodeModulesHash: string;
    private devYaml;
    private railgunYaml;
    hasPostCSSConfig: boolean;
    readonly hasProcfile: boolean;
    readonly isNode: boolean;
    readonly usesDev: boolean;
    readonly usesTypeScript: boolean;
    readonly usesPolaris: boolean;
    readonly usesReact: boolean;
    readonly usesPreact: boolean;
    readonly usesPreactCompat: boolean;
    readonly devType: {} | undefined;
    readonly devYamlPort: {} | undefined;
    readonly devProxyHosts: {
        host: string;
        port: number;
    }[];
    readonly devPort: number | undefined;
    constructor(isRails: boolean, packageJSON: PackageJSON, nodeModulesHash: string, devYaml: DevYaml | false, railgunYaml: RailgunYaml | false, hasPostCSSConfig: boolean, hasProcfile?: boolean);
    uses(dependency: string, versionCondition?: RegExp): boolean;
    hasDependency(dependency: string, versionCondition?: RegExp): boolean;
    hasDevDependency(dependency: string, versionCondition?: RegExp): boolean;
    private getDevKey;
    private getRailgunKey;
}
export default function loadProject(root: string): Promise<Project>;
