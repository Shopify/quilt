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
const env_1 = require("../env");
const config_1 = require("./config");
exports.Config = config_1.Config;
const project_1 = require("./project");
exports.Project = project_1.Project;
const paths_1 = require("./paths");
class Workspace {
    constructor(root, env, project, paths, config) {
        this.root = root;
        this.env = env;
        this.project = project;
        this.paths = paths;
        this.config = config;
    }
    get name() {
        return this.config.name;
    }
    duplicate(env = this.env) {
        return new Workspace(this.root, env, this.project, this.paths, this.config);
    }
}
exports.Workspace = Workspace;
function loadWorkspace(env = new env_1.default({ target: 'client', mode: 'development' }), runner, { config: configPath } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const root = process.cwd();
        try {
            const project = yield project_1.default(root);
            const config = yield config_1.default(configPath, env, project, runner);
            const paths = paths_1.default(root, env, config, project);
            return new Workspace(root, env, project, paths, config);
        } catch (error) {
            runner.logger.error(error);
            return runner.fail();
        }
    });
}
exports.default = loadWorkspace;