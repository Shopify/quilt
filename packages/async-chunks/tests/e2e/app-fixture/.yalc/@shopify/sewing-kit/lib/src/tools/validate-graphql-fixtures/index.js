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
const path_1 = require("path");
const graphql_1 = require("../graphql");
const utilities_1 = require("../utilities");
const TASK = Symbol('GraphQLFixtureLint');
function runValidateGraphQLFixtures(workspace, runner, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (!usesGraphQL || runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        yield graphql_1.default(workspace, runner);
        const { paths } = workspace;
        const executable = path_1.join(paths.sewingKitNodeModules, '.bin/graphql-validate-fixtures');
        const pathPrefix = utilities_1.projectSourceDirectoryGlobPattern(workspace);
        const showPasses = options.showPasses ? '--show-passes' : '';
        try {
            child_process_1.execSync(`
        ${JSON.stringify(executable)}
        ${JSON.stringify(path_1.join(pathPrefix, '**/*{Query,Mutation}/*.json'))}
        --operation-paths ${JSON.stringify(path_1.join(pathPrefix, '**/*.graphql'))}
        --schema-path ${JSON.stringify(utilities_1.graphQLSchemaPath(workspace))}
        ${showPasses}
      `.replace(/\n/g, ' ').trim(), { stdio: 'inherit' });
        } catch (error) {
            process.exit(1);
        }
    });
}
exports.default = runValidateGraphQLFixtures;