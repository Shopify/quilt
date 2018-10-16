export declare type Target = 'client' | 'server';
export declare type Mode = 'production' | 'development' | 'staging' | 'test';
export interface Options {
    target?: Target;
    mode?: Mode;
}
export default class Env {
    target: Target;
    mode: Mode;
    constructor({ target, mode }?: Options);
    readonly hasProductionAssets: boolean;
    readonly isClient: boolean;
    readonly isServer: boolean;
    readonly isProduction: boolean;
    readonly isDevelopment: boolean;
    readonly isNotDevelopment: boolean;
    readonly isStaging: boolean;
    readonly isTest: boolean;
    readonly isCircleCI: boolean;
    readonly isCI: boolean;
    readonly isDevelopmentClient: boolean;
    readonly isProductionClient: void;
    readonly isTestClient: boolean;
    readonly isDevelopmentServer: boolean;
    readonly isProductionServer: void;
    readonly isShopifyBuild: boolean;
    readonly isTestServer: boolean;
    toString(): string;
}
