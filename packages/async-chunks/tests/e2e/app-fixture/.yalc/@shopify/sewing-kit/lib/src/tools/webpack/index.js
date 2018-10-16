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
const webpack = require("webpack");
const graphql_1 = require("../graphql");
const graphql_typescript_definitions_1 = require("../graphql-typescript-definitions");
const svgo_1 = require("../svgo");
const config_1 = require("./config");
exports.createConfig = config_1.default;
exports.getServerBundle = config_1.getServerBundle;
const dev_1 = require("./dev");
exports.runDev = dev_1.default;
const clean_1 = require("./clean");
exports.clean = clean_1.default;
const manifest_1 = require("./manifest");
exports.manifest = manifest_1.default;
const playground_1 = require("./playground");
exports.runPlayground = playground_1.default;
const utilities_1 = require("./utilities");
var build_parallel_1 = require("./build-parallel");
exports.runParallelWebpack = build_parallel_1.runParallelWebpack;
const TASK = Symbol('Webpack');
function runWebpack(workspace, options = {}, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK, workspace)) {
            return;
        }
        runner.perform(TASK, workspace);
        if (options.clean) {
            yield clean_1.default(workspace, runner);
        }
        const { env } = workspace;
        if (env.hasProductionAssets && options.optimizeAssets) {
            yield svgo_1.default(workspace, runner);
        }
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (options.graphql && usesGraphQL) {
            yield graphql_1.default(workspace, runner);
            yield graphql_typescript_definitions_1.default(workspace, { watch: false }, runner);
        }
        const config = yield config_1.default(workspace, options);
        const compiler = webpack(config);
        // eslint-disable-next-line consistent-return
        return new Promise((resolve, reject) => {
            runner.logger.info(chalk => `${chalk.bold(`[${env.target}]`)} Compiling`);
            compiler.hooks.failed.tap('SewingKit.runWebpack', error => {
                reject(error);
            });
            compiler.run((err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (stats.hasErrors()) {
                    runner.logger.info(chalk => `${chalk.bold(`[${env.target}]`)} Compile failed with errors`);
                    reject(new Error(stats.toJson({ errors: true }).errors));
                    return;
                }
                if (stats.hasWarnings()) {
                    runner.logger.info(chalk => `${chalk.bold(`[${env.target}]`)} Compile failed with warnings`);
                    reject(new Error(stats.toJson({ errors: true }).warnings));
                    return;
                }
                runner.logger.info(chalk => `${chalk.bold(`[${env.target}]`)} Finished compiling (${utilities_1.compileTime(stats)})`);
                resolve();
            });
        });
    });
}
exports.default = runWebpack;