export interface PolyfillDescriptor {
    supportsNode: boolean;
    featureTest?: string;
}
export declare const polyfills: {
    [polyfill: string]: PolyfillDescriptor;
};
export declare function mappedPolyfillsForEnv(browser: 'node' | string | string[]): {};
