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
const fs_extra_1 = require("fs-extra");
const graphql_1 = require("../graphql");
const utilities_1 = require("../utilities");
const utilities_2 = require("./utilities");
const TASK = Symbol('GraphQLLint');
function runGraphQLLint(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (!usesGraphQL || runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        yield graphql_1.default(workspace, runner);
        const configPath = path_1.join(workspace.paths.private, 'eslint-graphql.config.json');
        yield utilities_1.makePrivateDirectory(workspace);
        yield fs_extra_1.writeFile(configPath, JSON.stringify({
            extends: ['plugin:shopify/graphql']
        }));
        yield utilities_2.execESLint(workspace, runner, `--config ${JSON.stringify(configPath)}`, ['.graphql']);
    });
}
exports.default = runGraphQLLint;