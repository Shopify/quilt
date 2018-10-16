import 'webpack-section-focus-loader';
import 'webpack-no-typescript-ts-loader';
import 'webpack-no-react-jsx-loader';
import { Workspace } from '../../../workspace';
export declare function sass(workspace: Workspace, { sourceMap }: {
    sourceMap: boolean;
}): ({
    test: RegExp;
    include: string[];
    use: any[];
    exclude?: undefined;
} | {
    test: RegExp;
    exclude: RegExp;
    use: any[];
    include?: undefined;
})[];
export declare function images({ env, paths, project }: Workspace): any[];
export declare function files(): {
    test: RegExp;
    loader: string;
    options: {
        name: string;
    };
};
export declare function fonts(): {
    test: RegExp;
    loader: string;
    options: {
        limit: number;
        mimetype: string;
        name: string;
    };
};
export declare type BabelPreset = string | [string, any];
export declare function javascript(workspace: Workspace): any[];
export declare function uncheckedTypescript(workspace: Workspace, { sourceMaps }?: {
    sourceMaps?: boolean | undefined;
}): {
    test: RegExp;
    exclude: RegExp;
    use: ({
        loader: string;
        options: {
            cacheDirectory: string;
            cacheIdentifier: string;
            babelrc: boolean;
            forceEnv: import("src/env").Mode;
            presets: BabelPreset[];
            plugins: string[];
            happyPackMode?: undefined;
            silent?: undefined;
            transpileOnly?: undefined;
            compilerOptions?: undefined;
        };
    } | {
        loader: string;
        options: {
            cacheDirectory: string;
            cacheIdentifier: string;
            happyPackMode?: undefined;
            silent?: undefined;
            transpileOnly?: undefined;
            compilerOptions?: undefined;
        };
    } | {
        loader: string;
        options: {
            happyPackMode: boolean;
            silent: boolean;
            transpileOnly: boolean;
            compilerOptions: {
                noEmit: boolean;
                skipLibCheck: boolean;
                skipDefaultLibCheck: boolean;
                strict: boolean;
                strictFunctionTypes: boolean;
                strictNullChecks: boolean;
                sourceMap: boolean;
            };
            cacheDirectory?: undefined;
            cacheIdentifier?: undefined;
        };
    })[];
} | null;
export declare function checkedTypescript(workspace: Workspace): {
    test: RegExp;
    exclude: RegExp;
    use: ({
        loader: string;
        options: {
            cacheDirectory: string;
            cacheIdentifier: string;
            babelrc: boolean;
            forceEnv: import("src/env").Mode;
            presets: BabelPreset[];
            plugins: string[];
            silent?: undefined;
            useBabel?: undefined;
            useCache?: undefined;
            transpileOnly?: undefined;
            compiler?: undefined;
        };
    } | {
        loader: string;
        options: {
            silent: boolean;
            useBabel: boolean;
            useCache: boolean;
            transpileOnly: boolean;
            compiler: string;
            cacheDirectory: string;
        };
    })[];
} | null;
export declare function graphql({ config, paths, project }: Workspace): {
    test: RegExp;
    use: ({
        loader: string;
        options: {
            cacheDirectory: string;
            cacheIdentifier: string;
        };
    } | {
        loader: string;
        options?: undefined;
    })[];
} | null;
export declare function focus({ paths }: Workspace, { sections }: {
    sections: string[];
}): {
    test(file: string): boolean;
    use: {
        loader: string;
        options: {
            focus: string[];
        };
    }[];
};
export declare function withoutTypescript(): {
    test: RegExp;
    use: {
        loader: string;
    }[];
};
export declare function withoutReact({ root }: Workspace): {
    test: RegExp;
    use: {
        loader: string;
        options: {
            root: string;
        };
    }[];
};
