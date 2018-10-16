import * as webpack from 'webpack';
export declare type ExcludeOption = string | RegExp;
export interface Options {
    exclude: ExcludeOption[];
}
export declare function findUnexpectedRemovals(compilation: webpack.compilation.Compilation, { exclude }: Options): any[];
export declare class FailOnUnexpectedModuleShakingPlugin implements webpack.Plugin {
    private options;
    constructor(options?: Partial<Options>);
    apply(compiler: webpack.Compiler): void;
}
