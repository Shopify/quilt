"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class IgnoreTypeScriptExportWarnings {
    apply(compiler) {
        compiler.hooks.done.intercept({
            call: stats => {
                const thisCompilation = stats.compilation;
                thisCompilation.warnings = thisCompilation.warnings.filter(warning => warning.name === 'ModuleDependencyWarning').filter(warning => Boolean(warning.module.resource)).filter(warning => warning.module.resource.match(/\.tsx?$/)).filter(warning => !warning.message.match(/export .+ was not found/));
            },
            loop: _ => {},
            tap: _ => {},
            register: tap => tap,
            context: false
        });
    }
}
exports.IgnoreTypeScriptExportWarnings = IgnoreTypeScriptExportWarnings;