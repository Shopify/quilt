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
const fs_extra_1 = require("fs-extra");
const graphql_config_1 = require("graphql-config");
const path_1 = require("path");
const utilities_1 = require("../utilities");
function projectSourceDirectories(workspace) {
    return utilities_1.flatten([utilities_1.ifElse(workspace.project.isNode, ['client', 'server']), path_1.relative(workspace.paths.root, workspace.paths.app)]);
}
exports.projectSourceDirectories = projectSourceDirectories;
function projectSourceDirectoryGlobPattern(workspace) {
    const dirs = projectSourceDirectories(workspace);
    return dirs.length > 1 ? `{${dirs.join(',')}}` : dirs[0];
}
exports.projectSourceDirectoryGlobPattern = projectSourceDirectoryGlobPattern;
function getGraphQLConfig({ paths: { root } }, runner) {
    try {
        return graphql_config_1.getGraphQLConfig(root);
    } catch (error) {
        if (error instanceof graphql_config_1.ConfigNotFoundError) {
            runner.logger.warn(chalk => `${chalk.bold(chalk.yellow('[graphql]'))} The graphql plugin requires a ${chalk.bold(graphql_config_1.GRAPHQL_CONFIG_NAME)} file in ${chalk.bold(root)} to build graphql typescript files. See ${chalk.underline('https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/graphql.md#graphql-config-file')} for graphql configuration documentation and examples.`);
            return null;
        } else {
            // unexpected error, rethrow
            throw error;
        }
    }
}
exports.getGraphQLConfig = getGraphQLConfig;
function graphQLSchemaPath(workspace, idl = false) {
    return path_1.join(workspace.paths.build, `schema.${idl ? 'graphql' : 'json'}`);
}
exports.graphQLSchemaPath = graphQLSchemaPath;
function appTypesPath({ paths: { app } }) {
    return path_1.join(app, 'types');
}
exports.appTypesPath = appTypesPath;
function graphQLSchemaTypesPath(workspace) {
    return path_1.join(appTypesPath(workspace), 'graphql');
}
exports.graphQLSchemaTypesPath = graphQLSchemaTypesPath;
function makePrivateDirectory({ paths }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.mkdirp(paths.private);
        yield fs_extra_1.writeFile(path_1.join(paths.private, '.gitignore'), '*');
    });
}
exports.makePrivateDirectory = makePrivateDirectory;
function makeGitIgnoredDirectory(path) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.mkdirp(path);
        yield fs_extra_1.writeFile(path_1.join(path, '.gitignore'), '*');
    });
}
exports.makeGitIgnoredDirectory = makeGitIgnoredDirectory;
function openFile(file, { line = 0, column = 0 } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const openInEditor = require('open-in-editor');
        const editor = openInEditor.configure();
        if (editor == null) {
            return;
        }
        yield editor.open(`${file}:${line}:${column}`);
    });
}
exports.openFile = openFile;