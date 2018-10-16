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
const path_1 = require("path");
const child_process_1 = require("child_process");
const chalk_1 = require("chalk");
const util_1 = require("util");
const exec = util_1.promisify(child_process_1.exec);
const TASK = Symbol('TypeScript');
function runTypeScript(workspace, runner, { watch } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!workspace.project.usesTypeScript || runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (usesGraphQL) {
            const { default: runGraphQLTypeScriptDefinitions } = yield Promise.resolve().then(() => require('../graphql-typescript-definitions'));
            yield runGraphQLTypeScriptDefinitions(workspace, { watch }, runner);
        }
        const executable = path_1.join(workspace.paths.nodeModules, '.bin/tsc');
        try {
            const switches = ['--noEmit', '--pretty', ...(watch ? ['--watch'] : [])];
            if (watch) {
                spawnTypeChecker(executable, switches, runner.logger);
            } else {
                yield exec(`${JSON.stringify(executable)} ${switches.join(' ')}`);
            }
        } catch (err) {
            if (typeof err.stdout !== 'string') {
                throw err;
            }
            runner.logger.warn(err.stdout + err.stderr);
            runner.fail();
        }
    });
}
exports.default = runTypeScript;
function spawnTypeChecker(command, switches, logger) {
    const label = `${chalk_1.default.bold(`[type-check]`)}`;
    const child = child_process_1.spawn(command, switches);
    child.stdout.on('data', data => {
        const message = friendlyMessage(data.toString());
        if (message.length > 0) {
            logger.info(`${label} ${message}`);
        }
    });
    child.stderr.on('data', data => {
        const error = data.toString();
        logger.error(new Error(`${label} ${error}`));
    });
    child.on('exit', () => {
        logger.info(`${label} process exited`);
    });
}
const CONSOLE_CLEAR_CODE = '\x1Bc';
const TIMESTAMP_PATTERN = /\[.*\]/g;
function friendlyMessage(rawMessage) {
    const message = rawMessage.replace(CONSOLE_CLEAR_CODE, '').trim();
    if (message.includes('Starting compilation in watch')) {
        return '📖 type checking';
    }
    if (message.includes('File change detected. Starting incremental')) {
        return '✏️  checking changed files';
    }
    const errors = /Found (\d+) errors?/g.exec(message);
    if (errors) {
        const numberOfErrors = Number.parseInt(errors[1], 10);
        if (numberOfErrors === 0) {
            return '✅ type checking succeeded';
        }
        return message
        // removes weird TSC timestamps
        .replace(TIMESTAMP_PATTERN, '❌').replace('Watching for file changes.', '');
    }
    return message;
}