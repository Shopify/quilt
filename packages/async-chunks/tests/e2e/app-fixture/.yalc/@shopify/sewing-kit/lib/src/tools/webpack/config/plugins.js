"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const path_1 = require("path");
const os_1 = require("os");
const webpack_asset_metadata_plugin_1 = require("../../../../../lib/packages/webpack-asset-metadata-plugin");
const webpack_plugin_1 = require("@shopify/async-chunks/webpack-plugin");
const webpack_ignore_typescript_export_warnings_plugin_1 = require("../../../../../lib/packages/webpack-ignore-typescript-export-warnings-plugin");
const fail_on_unexpected_module_shaking_plugin_1 = require("../../../../../lib/packages/fail-on-unexpected-module-shaking-plugin");
const utilities_1 = require("../../../utilities");
const utilities_2 = require("./utilities");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HashOutputPlugin = require('webpack-plugin-hash-output');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const Happypack = require('happypack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const nodeObjectHash = require('node-object-hash');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
function report({ env }) {
    return env.isClient && new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: './bundle-analysis/report.html',
        generateStatsFile: false,
        statsFilename: './bundle-analysis/stats.json',
        openAnalyzer: false
    });
}
exports.report = report;
const happypackThreadPool = Happypack.ThreadPool({
    size: os_1.cpus().length - 1
});
function styles(workspace, { sourceMap }) {
    const { env, paths, project } = workspace;
    function createHappypackPlugin({ id, loaders }) {
        return new Happypack({
            id,
            verbose: false,
            threadPool: happypackThreadPool,
            loaders
        });
    }
    return utilities_1.flatten([utilities_1.ifElse(env.isClient && env.hasProductionAssets, new MiniCssExtractPlugin({
        filename: '[name]-[contenthash].css',
        chunkFilename: '[id]-[contenthash].css'
    })), utilities_1.ifElse(env.isDevelopmentClient, createHappypackPlugin({
        id: 'styles',
        loaders: utilities_1.flatten([{ path: 'style-loader' }, {
            path: 'cache-loader',
            query: {
                cacheDirectory: path_1.join(paths.cache, 'webpack', `scss-${env.mode}-${env.target}`),
                cacheIdentifier: `cache-loader:sewing-kit:${project.nodeModulesHash}`
            }
        }, {
            path: 'css-loader',
            query: {
                sourceMap,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]-[local]_[hash:base64:5]'
            }
        }, {
            path: 'postcss-loader',
            query: utilities_1.removeEmptyValues({
                config: utilities_1.ifElse(!project.hasPostCSSConfig, {
                    path: workspace.paths.defaultPostCSSConfig
                }),
                sourceMap
            })
        }, {
            path: 'sass-loader',
            query: utilities_1.removeEmptyValues({
                sourceMap,
                includePaths: utilities_2.sassIncludePaths(workspace)
            })
        }, utilities_2.sassGlobalsLoader(workspace)])
    })), utilities_1.ifElse(project.usesPolaris && env.isDevelopmentClient, createHappypackPlugin({
        id: 'polaris-styles',
        loaders: utilities_1.flatten([{ path: 'style-loader' }, {
            path: 'cache-loader',
            query: {
                cacheDirectory: path_1.join(workspace.paths.cache, 'webpack', `polaris-scss-${env.mode}-${env.target}`),
                cacheIdentifier: `cache-loader:sewing-kit@${project.nodeModulesHash}`
            }
        }, {
            path: 'css-loader',
            query: {
                sourceMap: false,
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]'
            }
        }, {
            path: 'postcss-loader',
            query: utilities_1.removeEmptyValues({
                config: utilities_1.ifElse(!project.hasPostCSSConfig, {
                    path: workspace.paths.defaultPostCSSConfig
                }),
                sourceMap: false
            })
        }, {
            path: 'sass-loader',
            query: utilities_1.removeEmptyValues({
                sourceMap: false,
                includePaths: utilities_2.sassIncludePaths(workspace)
            })
        }, utilities_2.sassGlobalsLoader(workspace)])
    }))]);
}
exports.styles = styles;
function watch({ env }) {
    if (!env.isDevelopment && !env.isTest) {
        return null;
    }
    return utilities_1.flatten([utilities_1.ifElse(env.isDevelopment, new webpack.WatchIgnorePlugin([/\.d\.ts$/])), new webpack_ignore_typescript_export_warnings_plugin_1.IgnoreTypeScriptExportWarnings()]);
}
exports.watch = watch;
function manifests(workspace) {
    return utilities_1.flatten([assetsManifest(workspace), asyncChunksManifest(workspace)]);
}
exports.manifests = manifests;
function assetsManifest(workspace) {
    const manifestPath = utilities_2.getManifestPath(workspace);
    const { env, project } = workspace;
    // Generates a JSON file containing a map of all the output files for
    // our webpack bundle.  A necessisty for our server rendering process
    // as we need to interogate these files in order to know what JS/CSS
    // we need to inject into our HTML.
    return new webpack_asset_metadata_plugin_1.AssetMetadataPlugin({
        filename: path_1.basename(manifestPath),
        assetBasePath: project.isRails && env.isClient && env.hasProductionAssets ? path_1.join(workspace.paths.root, 'public') : false
    });
}
// TODO: throw error or warning message if reactLoadable is used. It should be migrated over to asyncChunks
function asyncChunksManifest(workspace) {
    const { env, project, config } = workspace;
    const { asyncChunks } = config.for('experiments');
    return asyncChunks && project.isNode && env.isClient ? new webpack_plugin_1.AsyncChunksPlugin() : null;
}
function output(workspace) {
    const { env, project } = workspace;
    return utilities_1.flatten([utilities_1.ifElse(env.isDevelopment, new webpack.NoEmitOnErrorsPlugin()), utilities_1.ifElse(env.isDevelopmentServer, new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })), utilities_1.ifElse(env.isClient && env.hasProductionAssets, new HashOutputPlugin()), utilities_1.ifElse(env.isClient && env.hasProductionAssets, new fail_on_unexpected_module_shaking_plugin_1.FailOnUnexpectedModuleShakingPlugin({
        exclude: []
    })), utilities_1.ifElse(env.hasProductionAssets && env.isClient && project.isRails, new CompressionPlugin({
        include: /\.(js|css|svg)$/
    }))]);
}
exports.output = output;
function input() {
    return new CaseSensitivePathsPlugin();
}
exports.input = input;
function define({ env }) {
    const mode = env.hasProductionAssets ? 'production' : env.mode;
    return new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode)
    });
}
exports.define = define;
function startup({ config, paths, env }) {
    const experimentsConfig = config.for('experiments');
    const { fastStartup } = experimentsConfig;
    return utilities_1.ifElse(fastStartup, new HardSourceWebpackPlugin({
        cacheDirectory: path_1.join(paths.cache, 'webpack', 'hard-source', `${env.mode}-${env.target}-[confighash]`),
        configHash: nodeObjectHash().hash
    }));
}
exports.startup = startup;
function lodash({ config, env, project }) {
    if (!env.isClient || !env.hasProductionAssets) {
        return null;
    }
    if (!project.hasDependency('lodash')) {
        return null;
    }
    const experiments = config.for('experiments');
    if (!experiments || !experiments.optimizeLodash) {
        return null;
    }
    // create smaller lodash builds by replacing feature sets with simpler alternatives
    return [new LodashModuleReplacementPlugin()];
}
exports.lodash = lodash;
function chunkNaming({ env }) {
    if (!env.isClient || !env.hasProductionAssets) {
        return null;
    }
    const chunkNamingPlugins = [new webpack.NamedChunksPlugin(chunk => {
        if (chunk.name) {
            return chunk.name;
        }
        const chunkPath = Array.from(chunk.modulesIterable).map(module => {
            if (module.constructor.name === 'CssModule') {
                const filename = path_1.relative(module.context, module.issuer.resource);
                return path_1.basename(filename, path_1.extname(filename));
            }
            return path_1.relative(module.context, module.request);
        }).join('_');
        return path_1.parse(chunkPath).name;
    })];
    return chunkNamingPlugins;
}
exports.chunkNaming = chunkNaming;