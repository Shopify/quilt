"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const utilities_1 = require("../utilities");
const TASK = Symbol('CleanGraphQLTypeScriptDefinitions');
function cleanGraphQLDocumentTypes(workspace) {
    child_process_1.execSync(`find ${utilities_1.projectSourceDirectories(workspace).join(' ')} -name '*.graphql.d.ts' -delete`, { stdio: 'inherit' });
}
exports.cleanGraphQLDocumentTypes = cleanGraphQLDocumentTypes;
function cleanGraphQLSchemaTypes(workspace) {
    child_process_1.execSync(`find ${utilities_1.appTypesPath(workspace)} -name 'graphql.ts' -delete`, {
        stdio: 'inherit'
    });
    child_process_1.execSync(`find ${utilities_1.graphQLSchemaTypesPath(workspace)} -name '*types.ts' -delete`, { stdio: 'inherit' });
}
exports.cleanGraphQLSchemaTypes = cleanGraphQLSchemaTypes;
function cleanGraphQLTypeScriptDefinitions(workspace, runner) {
    const usesGraphQL = Boolean(workspace.config.for('graphql'));
    if (!workspace.project.usesTypeScript || !usesGraphQL || runner.hasPerformed(TASK)) {
        return;
    }
    runner.perform(TASK);
    cleanGraphQLDocumentTypes(workspace);
    cleanGraphQLSchemaTypes(workspace);
}
exports.default = cleanGraphQLTypeScriptDefinitions;