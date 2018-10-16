"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const utilities_1 = require("../../utilities");
function getFileTypeGlobs(options) {
    const { graphql, json, markdown } = options;
    const fileTypes = utilities_1.flatten([json ? 'json' : null, graphql ? ['graphql', 'gql'] : null, markdown ? 'md' : null]);
    if (fileTypes.length === 0) {
        return false;
    }
    const paths = fileTypes.length > 1 ? `./**/*.{${fileTypes.join(',')}}` : `./**/*.${fileTypes.join(',')}`;
    return paths;
}
exports.getFileTypeGlobs = getFileTypeGlobs;
function prettierExecutable(workspace) {
    return path_1.join(workspace.paths.sewingKitNodeModules, '.bin/prettier');
}
exports.prettierExecutable = prettierExecutable;