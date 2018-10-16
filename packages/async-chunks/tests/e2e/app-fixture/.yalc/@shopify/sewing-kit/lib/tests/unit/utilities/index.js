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
const path = require("path");
const fs_extra_1 = require("fs-extra");
const yargs_1 = require("yargs");
const workspace_1 = require("../../../src/workspace");
const paths_1 = require("../../../src/workspace/paths");
const env_1 = require("../../../src/env");
const sewingKit = process.cwd();
function createWorkspace({ root = process.cwd(), isRails = false, hasPostCSSConfig = false, hasProcfile = false, dependencies = {}, devDependencies = {}, devYaml = false, railgunYaml = false, plugins = [], paths = {}, env = new env_1.default({ target: 'client', mode: 'development' }), nodeModulesHash = 'fake_node_modules_hash' } = {}) {
    const project = new workspace_1.Project(isRails, { dependencies, devDependencies }, nodeModulesHash, devYaml, railgunYaml, hasPostCSSConfig, hasProcfile);
    const config = new workspace_1.Config(path.basename(root), plugins);
    const finalPaths = Object.assign({}, paths_1.default(root, env, config, project), paths);
    return new workspace_1.Workspace(root, env, project, finalPaths, config);
}
exports.createWorkspace = createWorkspace;
const DEFAULT_VERSIONS = {
    react: '15.0.0',
    typescript: '2.0.0',
    '@shopify/polaris': '1.0.0'
};
function createDependency(name, version = '1.0.0') {
    return {
        [name]: DEFAULT_VERSIONS.hasOwnProperty(name) ? DEFAULT_VERSIONS[name] : version
    };
}
exports.createDependency = createDependency;
function parseCommand(command) {
    const yargsParse = yargs_1.parse(command);
    const [executable, ...positionalArgs] = yargsParse._;
    delete yargsParse.$0;
    delete yargsParse._;
    return Object.assign({ executable,
        positionalArgs }, yargsParse);
}
exports.parseCommand = parseCommand;
const TMP_DIR = path.join(sewingKit, 'tests', 'tmp');
function withTempFixture(fixtureDir, callback) {
    const finalPath = path.join(TMP_DIR, `${path.basename(fixtureDir)}`);
    return doneCallback => {
        fs_extra_1.mkdirpSync(finalPath);
        fs_extra_1.copySync(fixtureDir, finalPath);
        const originalCwd = process.cwd();
        function cleanup() {
            process.chdir(originalCwd);
            fs_extra_1.removeSync(finalPath);
        }
        process.chdir(finalPath);
        try {
            const result = callback(finalPath);
            if (result && result.then) {
                return result.then(result => __awaiter(this, void 0, void 0, function* () {
                    cleanup();
                    doneCallback(result);
                })).catch(error => __awaiter(this, void 0, void 0, function* () {
                    cleanup();
                    throw error;
                }));
            } else {
                cleanup();
                return doneCallback(result);
            }
        } catch (error) {
            cleanup();
            throw error;
        }
    };
}
exports.withTempFixture = withTempFixture;
function withTempDir(name, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalPath = path.join(TMP_DIR, name);
        const originalCWD = process.cwd();
        try {
            yield fs_extra_1.mkdirp(finalPath);
            process.chdir(finalPath);
            yield callback(finalPath);
        } catch (error) {
            throw error;
        } finally {
            yield fs_extra_1.remove(finalPath);
            process.chdir(originalCWD);
        }
    });
}
exports.withTempDir = withTempDir;
function stripString(dir, callArgs) {
    if (!callArgs || ['boolean', 'number', 'symbol'].includes(typeof callArgs)) {
        return callArgs;
    } else if (typeof callArgs === 'string') {
        return callArgs.replace(new RegExp(dir, 'g'), '');
    } else if (Array.isArray(callArgs)) {
        return callArgs.map(arg => stripString(dir, arg));
    } else {
        const result = {};
        Object.keys(callArgs).forEach(key => {
            result[key] = stripString(dir, callArgs[key]);
        });
        return result;
    }
}
exports.stripString = stripString;
function withEnv(overrides, callback) {
    const originalEnv = Object.assign({}, process.env);
    function resetEnv() {
        process.env = originalEnv;
    }
    process.env = Object.assign({}, process.env, overrides);
    try {
        const result = callback();
        if (result && result.then) {
            return result.then(result => {
                resetEnv();
                return result;
            }).catch(error => {
                resetEnv();
                throw error;
            });
        } else {
            resetEnv();
            return result;
        }
    } catch (error) {
        resetEnv();
        throw error;
    }
}
exports.withEnv = withEnv;
var fake_runner_1 = require("./fake-runner");
exports.FakeRunner = fake_runner_1.FakeRunner;