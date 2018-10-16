"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../../utilities");
const optimization_1 = require("./optimization");
const utilities_2 = require("./utilities");
exports.getServerBundle = utilities_2.getServerBundle;
exports.getManifestPath = utilities_2.getManifestPath;
const rules_1 = require("./rules");
function webpackConfig(workspace, { sourceMaps = 'accurate', report: buildReport = false, vscodeDebug = false, uglify = 'on', focus: sections = [] } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { env, paths } = workspace;
        const { chunkNaming, report, watch, styles, manifests, startup, input, define, lodash, output: outputPlugin } = yield Promise.resolve().then(() => require('./plugins'));
        const { devtool } = yield Promise.resolve().then(() => require('./devtool'));
        const { default: resolve } = yield Promise.resolve().then(() => require('./resolve'));
        const { default: entry } = yield Promise.resolve().then(() => require('./entry'));
        const { default: output } = yield Promise.resolve().then(() => require('./output'));
        const { default: externals } = yield Promise.resolve().then(() => require('./externals'));
        const config = utilities_1.removeEmptyValues({
            cache: env.isDevelopment,
            mode: env.isDevelopment || env.isTest ? 'development' : 'production',
            target: utilities_1.ifElse(env.isServer, 'node', 'web'),
            // We have to set this to be able to use these items when executing a
            // server bundle.  Otherwise strangeness happens, like __dirname resolving
            // to '/'.  There is no effect on our client bundle.
            node: utilities_1.ifElse(env.isServer, {
                __dirname: true,
                __filename: true
            }),
            entry: entry(workspace),
            output: output(workspace, { vscodeDebug }),
            externals: externals(workspace),
            devtool: devtool(workspace, { sourceMaps }),
            optimization: optimization_1.optimization(workspace, {
                sourceMaps: sourceMaps !== 'off',
                uglify
            }),
            performance: { hints: false },
            plugins: utilities_1.flatten([input(), startup(workspace), define(workspace), watch(workspace), styles(workspace, { sourceMap: sourceMaps !== 'off' }), utilities_1.ifElse(buildReport, report(workspace)), outputPlugin(workspace), manifests(workspace), utilities_1.ifElse(env.isClient && env.hasProductionAssets, lodash(workspace)), utilities_1.ifElse(env.isClient && env.hasProductionAssets, chunkNaming(workspace))]),
            module: {
                rules: utilities_1.flatten([utilities_1.ifElse(sections.length > 0, rules_1.focus(workspace, { sections })), rules_1.javascript(workspace), utilities_1.ifElse(env.isDevelopment || env.isTest, rules_1.uncheckedTypescript(workspace, { sourceMaps: sourceMaps !== 'off' }), rules_1.checkedTypescript(workspace)), rules_1.sass(workspace, { sourceMap: sourceMaps !== 'off' }), rules_1.images(workspace), rules_1.files(), rules_1.fonts(), rules_1.graphql(workspace), utilities_1.ifElse(!workspace.project.usesTypeScript, rules_1.withoutTypescript()), utilities_1.ifElse(!workspace.project.usesReact && !workspace.project.usesPreact, rules_1.withoutReact(workspace))])
            },
            resolve: resolve(workspace),
            resolveLoader: {
                modules: [paths.sewingKitNodeModules, paths.nodeModules]
            }
        });
        const webpackConfig = workspace.config.for('webpack');
        return webpackConfig ? webpackConfig.configure(config) : config;
    });
}
exports.default = webpackConfig;