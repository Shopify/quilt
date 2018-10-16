"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
// eslint-disable-next-line no-warning-comments
// TODO: assert on "guaranteed" packages and throw if not present
function loadPaths(root, env, config, project) {
    let sewingKit = path_1.resolve(__dirname, '../..');
    if (path_1.basename(sewingKit) === 'lib') {
        sewingKit = path_1.resolve(sewingKit, '..');
    }
    const pathsPlugin = config.for('paths');
    const customPaths = pathsPlugin ? pathsPlugin.paths : {};
    const appPath = customPaths.app || (project.isNode ? path_1.join(root, 'app') : path_1.join(root, 'app/ui'));
    const buildPath = customPaths.build || defaultBuildDirectory(env, project, root);
    const cachePath = customPaths.cache || (project.isRails ? path_1.join(root, 'tmp', 'cache', 'sewing-kit') : path_1.join(buildPath, 'cache'));
    return {
        sewingKit,
        sewingKitNodeModules: path_1.join(sewingKit, 'node_modules'),
        root,
        private: customPaths.private || path_1.join(root, '.sewing-kit'),
        playground: customPaths.playground || path_1.join(root, 'playground'),
        packages: customPaths.packages || pathIfExists(path_1.join(root, 'packages')),
        nodeModules: customPaths.nodeModules || path_1.join(root, 'node_modules'),
        app: appPath,
        styles: customPaths.styles || path_1.join(appPath, 'styles'),
        components: customPaths.components || path_1.join(appPath, 'components'),
        sections: customPaths.sections || path_1.join(appPath, 'sections'),
        build: buildPath,
        cache: cachePath,
        tests: customPaths.tests || path_1.join(root, 'tests'),
        defaultPostCSSConfig: path_1.resolve(__dirname, 'postcss.config')
    };
}
exports.default = loadPaths;
function pathIfExists(filepath) {
    return fs_extra_1.existsSync(filepath) ? filepath : undefined;
}
function defaultBuildDirectory({ isDevelopment }, { isRails }, root) {
    if (isRails) {
        if (isDevelopment) {
            return path_1.join(root, 'tmp/sewing-kit');
        } else {
            return path_1.join(root, 'public', 'bundles');
        }
    } else {
        return path_1.join(root, 'build');
    }
}