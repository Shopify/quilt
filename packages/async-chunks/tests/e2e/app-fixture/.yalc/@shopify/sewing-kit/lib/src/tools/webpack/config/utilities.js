"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../../../utilities");
const memoize = require('lodash/memoize');
// For subresource integrity checks.
exports.HASH_FUNCTION = 'sha256';
exports.HASH_DIGEST_LENGTH = 64;
function buildDir({ project, env, paths }) {
    return utilities_1.ifElse(project.isRails, paths.build, path.join(paths.build, env.target));
}
exports.buildDir = buildDir;
function getServerBundle({ output, entry }) {
    if (output == null) {
        throw new Error('server output options not defined.');
    }
    if (entry == null) {
        throw new Error('server entry not defined');
    }
    const name = typeof entry === 'string' || Array.isArray(entry) ? 'main' : Object.keys(entry)[0];
    return path.join(output.path || '', `${name}.js`);
}
exports.getServerBundle = getServerBundle;
function getManifestPath(workspace) {
    const manifestConfig = workspace.config.for('manifest');
    const customFilename = manifestConfig && manifestConfig.filename;
    const name = customFilename || utilities_1.ifElse(workspace.project.isRails, 'sewing-kit-manifest.json', 'assets.json');
    return path.join(buildDir(workspace), name);
}
exports.getManifestPath = getManifestPath;
exports.sassIncludePaths = memoize(({ project, paths }) => utilities_1.flatten([paths.styles, utilities_1.ifElse(project.usesPolaris, path.join(paths.nodeModules, '@shopify/polaris/styles'))]));
exports.sassGlobalsLoader = memoize(({ env, paths, project, config }) => {
    const polarisRoot = env.isDevelopment || env.isTest ? path.join(paths.nodeModules, '@shopify/polaris') : path.join(paths.nodeModules, '@shopify/polaris', 'esnext');
    const settingsPath = path.join(paths.styles, 'settings.scss');
    const sassPlugin = config.for('sass');
    const globalResources = utilities_1.flatten([utilities_1.ifElse(fs_extra_1.existsSync(settingsPath), settingsPath), sassPlugin && sassPlugin.autoInclude, utilities_1.ifElse(project.usesPolaris, [path.join(polarisRoot, 'styles/foundation.scss'), path.join(polarisRoot, 'styles/shared.scss')])]);
    return utilities_1.ifElse(globalResources.length > 0, {
        loader: 'sass-resources-loader',
        options: {
            resources: globalResources
        }
    });
});