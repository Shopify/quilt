"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function optimization(workspace, { sourceMaps, uglify }) {
    const { env } = workspace;
    if (env.isClient && env.hasProductionAssets) {
        return optimizeProductionClient(workspace, { sourceMaps, uglify });
    } else if (env.isServer && env.hasProductionAssets) {
        return optimizeServer();
    }
    return null;
}
exports.optimization = optimization;
function optimizeProductionClient({ env, paths }, { sourceMaps = true, uglify }) {
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
    const uglifyES = new UglifyJsPlugin({
        cache: path_1.resolve(paths.cache, 'webpack', 'uglify'),
        parallel: env.isCircleCI || env.isShopifyBuild ? 3 : true,
        sourceMap: sourceMaps,
        uglifyOptions: Object.assign({ ecma: 5, warnings: false, compress: true, ie8: false, safari10: true, mangle: {
                safari10: true
            }, output: {
                ecma: 5
            } }, beautifyOptions(uglify))
    });
    return {
        concatenateModules: true,
        minimize: true,
        minimizer: [uglifyES],
        namedChunks: true,
        namedModules: true,
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            // Arbitrary "we'll probably never need this many" number to encourage code sharing between bundles.
            maxAsyncRequests: 10
        }
    };
}
function optimizeServer() {
    return {
        concatenateModules: false,
        minimize: false,
        namedChunks: true,
        namedModules: true,
        runtimeChunk: false,
        splitChunks: false,
        // Don't strip out server polyfills.
        sideEffects: false
    };
}
function beautifyOptions(uglifyStrategy) {
    if (uglifyStrategy !== 'beautify') {
        return {};
    }
    return {
        output: { beautify: true },
        compress: {
            booleans: false,
            conditionals: false,
            comparisons: false,
            // eslint-disable-next-line camelcase
            dead_code: true,
            inline: false
        },
        mangle: false
    };
}