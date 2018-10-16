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
const child_process_1 = require("child_process");
const path = require("path");
const util_1 = require("util");
const utilities_1 = require("../../utilities");
exports.command = 'start';
exports.desc = '(Node only) - starts a local server in production mode';
const TASK = Symbol('ParallelWebpack');
function runParallelWebpack(options, runner, clientWorkspace, serverWorkspace) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const { default: runSVGO } = yield Promise.resolve().then(() => require('../../tools/svgo'));
        if (options.clean) {
            yield clean(clientWorkspace, options, runner);
            yield clean(serverWorkspace, options, runner);
        }
        yield Promise.all(utilities_1.flatten([options.optimizeAssets ? runSVGO(clientWorkspace, runner) : null, options.graphql ? graphql(clientWorkspace, runner) : null]));
        runner.logger.info(chalk => `${chalk.bold('[sewing-kit]')} Compiling client / server`);
        const [clientResult, serverResult] = yield Promise.all([execAsync(sewingKitCommand('client', options.clientHeapSize, options, runner)), execAsync(sewingKitCommand('server', options.serverHeapSize, options, runner))]);
        if (clientResult.code > 0) {
            if (clientResult.error) {
                runner.logger.error(clientResult.error);
            }
            runner.logger.warn(clientResult.stderr);
        }
        runner.logger.info(clientResult.stdout);
        if (serverResult.code > 0) {
            if (serverResult.error) {
                runner.logger.error(serverResult.error);
            }
            runner.logger.warn(serverResult.stderr);
        }
        runner.logger.info(serverResult.stdout);
        if (clientResult.code > 0 || serverResult.code > 0) {
            runner.fail();
        }
    });
}
exports.runParallelWebpack = runParallelWebpack;
function sewingKitCommand(target, heapSize, options, runner) {
    const executable = path.join('node_modules', '.bin', 'sewing-kit');
    const focusOption = options.focus && options.focus.length > 0 ? `--focus ${options.focus.join(' ')}` : '';
    const command = `${executable} build --${target}-only --no-clean --no-optimize-assets --no-graphql --source-maps ${options.sourceMaps || 'fast'} --uglify ${options.uglify} ${focusOption}`.trim();
    if (heapSize) {
        runner.logger.info(`${target} heap size: ${heapSize}`);
        return `node --max-old-space-size=${heapSize} ${command}`;
    }
    return command;
}
function clean(workspace, options, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const { default: cleanWebpack } = yield Promise.resolve().then(() => require('../../tools/webpack/clean'));
        yield cleanWebpack(workspace, runner);
        if (!options.graphql) {
            return;
        }
        const { clean: cleanGraphQLTypeScriptDefinitions } = yield Promise.resolve().then(() => require('../../tools/graphql-typescript-definitions'));
        const { clean: cleanGraphQLSchema } = yield Promise.resolve().then(() => require('../../tools/graphql'));
        yield cleanGraphQLSchema(workspace, runner);
        yield cleanGraphQLTypeScriptDefinitions(workspace, runner);
    });
}
function graphql(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (!usesGraphQL) {
            return;
        }
        const { default: buildGraphQL } = yield Promise.resolve().then(() => require('../../tools/graphql'));
        const { default: runGraphQLTypeScriptDefinitions } = yield Promise.resolve().then(() => require('../../tools/graphql-typescript-definitions'));
        yield buildGraphQL(workspace, runner);
        yield runGraphQLTypeScriptDefinitions(workspace, { watch: false }, runner);
    });
}
function execAsync(command) {
    return __awaiter(this, void 0, void 0, function* () {
        return util_1.promisify(child_process_1.exec)(command).then(result => {
            return result;
        }).catch(err => {
            return err;
        });
    });
}