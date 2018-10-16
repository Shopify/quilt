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
const graphql_typescript_definitions_1 = require("graphql-typescript-definitions");
const graphql_1 = require("../graphql");
const utilities_1 = require("../utilities");
const clean_1 = require("./clean");
exports.clean = clean_1.default;
const TASK = Symbol('GraphQLTypeScriptDefinitions');
function buildGraphQLTypeScriptDefinitions(workspace, { watch = false }, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        const graphqlConfig = utilities_1.getGraphQLConfig(workspace, runner);
        if (!workspace.project.usesTypeScript || !usesGraphQL || !graphqlConfig || runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        yield clean_1.default(workspace, runner);
        yield graphql_1.default(workspace, runner);
        const builder = new graphql_typescript_definitions_1.Builder({
            cwd: workspace.paths.root,
            schemaTypesPath: utilities_1.graphQLSchemaTypesPath(workspace),
            enumFormat: graphql_typescript_definitions_1.EnumFormat.PascalCase,
            addTypename: true
        });
        builder.on('end:docs', () => {
            // prettier-ignore
            runner.logger.info(chalk => `${chalk.bold('[graphql]')} Built GraphQL type definitions`);
        });
        builder.on('end:schema', () => {
            // prettier-ignore
            runner.logger.info(chalk => `${chalk.bold('[graphql]')} Built GraphQL schema types`);
        });
        builder.on('error', error => {
            runner.logger.error(error);
            if (!watch) {
                process.exit(1);
            }
        });
        builder.on('build:docs', ({ definitionPath }) => {
            runner.logger.debug(
            // prettier-ignore
            chalk => `${chalk.bold('[graphql]')} Built GraphQL type definition: ${definitionPath}`);
        });
        builder.on('build:schema', ({ schemaTypesPath }) => {
            runner.logger.debug(
            // prettier-ignore
            chalk => `${chalk.bold('[graphql]')} Built GraphQL schema types: ${schemaTypesPath}`);
        });
        // eslint-disable-next-line consistent-return
        return new Promise(resolve => {
            builder.once('end:docs', resolve);
            builder.run({ watch });
        });
    });
}
exports.default = buildGraphQLTypeScriptDefinitions;