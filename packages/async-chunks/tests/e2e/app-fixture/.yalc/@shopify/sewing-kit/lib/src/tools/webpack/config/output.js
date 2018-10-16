"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../../utilities");
const utilities_2 = require("./utilities");
const railgunWebpackProxyPath = '/webpack/assets/';
const shopifyCloudAssetPath = '/bundles/';
function publicPath({ config, env, project }) {
    const cdnPlugin = config.for('cdn');
    if (cdnPlugin && cdnPlugin.url) {
        return cdnPlugin.url;
    }
    if (project.isNode) {
        if (env.isDevelopment && project.usesDev) {
            return railgunWebpackProxyPath;
        }
        return '/assets/';
    }
    return env.isDevelopment ? railgunWebpackProxyPath : shopifyCloudAssetPath;
}
function output(workspace, { vscodeDebug }) {
    const { env } = workspace;
    const outPath = utilities_2.buildDir(workspace);
    const vscodeOutput = vscodeDebug ? {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    } : {};
    // prettier-ignore
    return utilities_1.removeEmptyValues(Object.assign({ path: outPath, publicPath: publicPath(workspace), filename: utilities_1.ifElse(env.isServer,
        // eslint-disable-next-line no-warning-comments
        // TODO: remove once https://github.com/Shopify/sewing-kit/issues/626 is fixed.
        'main.js', utilities_1.ifElse(env.isClient && env.hasProductionAssets, '[name]-[chunkhash].js', '[name].js')), chunkFilename: '[name]-[chunkhash].js', crossOriginLoading: utilities_1.ifElse(env.isDevelopmentClient, 'anonymous'), libraryTarget: utilities_1.ifElse(env.isServer, 'commonjs2', 'var'), hashFunction: utilities_2.HASH_FUNCTION, hashDigestLength: utilities_2.HASH_DIGEST_LENGTH }, vscodeOutput));
}
exports.default = output;