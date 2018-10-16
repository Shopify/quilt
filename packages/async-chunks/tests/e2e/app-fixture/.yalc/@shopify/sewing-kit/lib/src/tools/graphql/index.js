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
const graphql_1 = require("graphql");
const utilities_1 = require("../utilities");
const clean_1 = require("./clean");
exports.clean = clean_1.default;
const utilities_2 = require("./utilities");
const TASK = Symbol('GraphQLSchema');
function buildGraphQL(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const { config, env } = workspace;
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (!usesGraphQL || runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const graphQLPlugin = config.for('graphql');
        if (graphQLPlugin == null) {
            runner.fail();
            return;
        }
        let schema;
        const schemaDownloadStart = Date.now();
        if (!env.isCI && (env.isDevelopment || env.isTest) && graphQLPlugin.schema.development != null) {
            try {
                schema = yield utilities_2.loadSchema(graphQLPlugin.schema.development);
                runner.logger.debug(`Using schema from ${graphQLPlugin.schema.development}`);
            } catch (error) {
                runner.logger.info(`Failed to retrieve development schema from ${graphQLPlugin.schema.development}; falling back to production schema`);
                schema = yield utilities_2.loadSchema(graphQLPlugin.schema.production);
                runner.logger.debug(`Using schema from ${graphQLPlugin.schema.production}`);
            }
        } else {
            const uri = graphQLPlugin.schema.production;
            try {
                schema = yield utilities_2.loadProductionSchema(uri);
            } catch (error) {
                runner.logger.warn(`Schema download failed; retrying.  ${error}`);
                try {
                    schema = yield utilities_2.loadProductionSchema(uri);
                } catch (retryError1) {
                    runner.logger.warn(`Schema download failed; retrying.  ${error}`);
                    schema = yield utilities_2.loadSchema(uri);
                }
            }
            runner.logger.debug(`Using schema from ${graphQLPlugin.schema.production}`);
        }
        if (env.isCI) {
            const downloadTime = Date.now() - schemaDownloadStart;
            runner.logger.info(chalk => `[${chalk.bold('graphql')}] Schema downloaded (${downloadTime}ms)`);
        }
        yield clean_1.default(workspace, runner);
        yield fs_extra_1.mkdirp(path_1.dirname(utilities_1.graphQLSchemaPath(workspace)));
        yield Promise.all([
        // This JSON blob represents our entire schema. It is used by our
        // tools for linting GraphQL documents and fixtures, as well as for
        // generating the type definitions from GraphQL documents.
        fs_extra_1.writeFile(utilities_1.graphQLSchemaPath(workspace), JSON.stringify(schema, null, 2)),
        // This JSON blob is a simplified representation of only the union and intersection
        // types in the schema. This is needed for Apollo to correctly identify fragments
        // on these types.
        fs_extra_1.writeFile(utilities_2.graphQLUnionAndInterfacesPath(workspace), JSON.stringify(utilities_2.getUnionsAndInterfacesFromInstrospection(schema), null, 2)),
        // The .graphql file (referred to as a GraphQL IDL) is a human-readable
        // representation of the schema. It is used to provide autocompletion and
        // as a target for "go to definition" in GraphQL files.
        fs_extra_1.writeFile(utilities_1.graphQLSchemaPath(workspace, true), graphql_1.printSchema(graphql_1.buildClientSchema(schema.data)))]);
    });
}
exports.default = buildGraphQL;