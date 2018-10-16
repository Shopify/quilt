"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pluginName = 'FailOnUnexpectedModuleShakingPlugin';
function isExcluded(module, exclude = []) {
    return exclude.find(excludePath => typeof excludePath === 'string' ? module === excludePath : excludePath.test(module));
}
function isSideEffectImport(module) {
    const { buildMeta } = module;
    if (Array.isArray(buildMeta.providedExports) && buildMeta.providedExports.length > 0) {
        return false;
    }
    return module.reasons.every(reason => reason.dependency.constructor.name === 'HarmonyImportSideEffectDependency');
}
function isSideEffectFree(module) {
    // `webpack/lib/optimize/SideEffectsFlagPlugin` sets this value.
    return module.factoryMeta.sideEffectFree === true;
}
function findUnexpectedRemovals(compilation, { exclude }) {
    const context = compilation.options.context;
    const removed = compilation.modules.filter(module => Boolean(module.resource)).filter(isSideEffectImport).filter(isSideEffectFree).map(module => module.resource.replace(new RegExp(`^${context}/`), './'));
    return removed.filter(module => !isExcluded(module, exclude));
}
exports.findUnexpectedRemovals = findUnexpectedRemovals;
class FailOnUnexpectedModuleShakingPlugin {
    constructor(options = {}) {
        this.options = {
            exclude: options.exclude || []
        };
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(pluginName, compilation => {
            compilation.hooks.afterOptimizeTree.tap(pluginName, () => {
                const removed = findUnexpectedRemovals(compilation, this.options);
                if (removed.length > 0) {
                    const moduleNames = removed.sort().join('",\n    "');
                    compilation.errors.push(`webpack has removed these modules:\n    "${moduleNames}"\n\n` + '• If a module is necessary for production, preserve it by adding it to package.json#sideEffects (for more information, see https://github.com/webpack/webpack/tree/master/examples/side-effects)\n' + `• If a module can be safely removed, add it to ${pluginName}'s 'exclude' list`);
                }
            });
        });
    }
}
exports.FailOnUnexpectedModuleShakingPlugin = FailOnUnexpectedModuleShakingPlugin;