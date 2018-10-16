"use strict";

var _this = this;

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
const path = require("path");
const webpack_1 = require("webpack");
const fail_on_unexpected_module_shaking_plugin_1 = require("../../../../../../lib/packages/fail-on-unexpected-module-shaking-plugin");
const webpack_asset_metadata_plugin_1 = require("../../../../../../lib/packages/webpack-asset-metadata-plugin");
const webpack_ignore_typescript_export_warnings_plugin_1 = require("../../../../../../lib/packages/webpack-ignore-typescript-export-warnings-plugin");
const webpack_plugin_1 = require("@shopify/async-chunks/webpack-plugin");
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../env");
const plugins = require("../../../../plugins");
const config_1 = require("../../config");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HashOutputPlugin = require('webpack-plugin-hash-output');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const Happypack = require('happypack');
const HardSourcePlugin = require('hard-source-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { LimitChunkCountPlugin } = webpack_1.optimize;
const server = new env_1.default({ target: 'server' });
const client = new env_1.default({ target: 'client' });
const development = new env_1.default({ mode: 'development' });
const production = new env_1.default({ mode: 'production' });
const test = new env_1.default({ mode: 'test' });
describe('webpackConfig()', () => {
    describe('plugins', () => {
        function getPluginOfType(type, plugins) {
            return getPluginsOfType(type, plugins)[0];
        }
        function getPluginsOfType(type, plugins) {
            return plugins.filter(plugin => plugin.constructor === type);
        }
        function hasPluginOfType(type, plugins) {
            return getPluginsOfType(type, plugins).length > 0;
        }
        describe('input', () => {
            it('includes a case-sensitive paths plugin', () => __awaiter(_this, void 0, void 0, function* () {
                const { plugins } = yield config_1.default(utilities_1.createWorkspace());
                expect(hasPluginOfType(CaseSensitivePathsPlugin, plugins)).toBe(true);
            }));
        });
        describe('define', () => {
            it.each([[new env_1.default({ mode: 'development', target: 'client' })], [new env_1.default({ mode: 'development', target: 'server' })], [new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'test', target: 'client' })], [new env_1.default({ mode: 'test', target: 'server' })]])(`includes a define plugin that sets NODE_ENV=%s`, env => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env });
                const { plugins } = yield config_1.default(workspace);
                expect(hasPluginOfType(webpack_1.DefinePlugin, plugins)).toBe(true);
                expect(getPluginOfType(webpack_1.DefinePlugin, plugins)).toHaveProperty('definitions', {
                    'process.env.NODE_ENV': `"${env.mode}"`
                });
            }));
            it.each([[new env_1.default({ mode: 'staging', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'server' })]])(`includes a define plugin that sets NODE_ENV=production for better library tree shaking`, env => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env });
                const { plugins } = yield config_1.default(workspace);
                expect(hasPluginOfType(webpack_1.DefinePlugin, plugins)).toBe(true);
                expect(getPluginOfType(webpack_1.DefinePlugin, plugins)).toHaveProperty('definitions', {
                    'process.env.NODE_ENV': `"production"`
                });
            }));
        });
        describe('lodash', () => {
            describe.each([['production'], ['staging']])('%s', mode => {
                it('omits LodashModuleReplacementPlugin when lodash is not a dependency', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode }),
                        plugins: [plugins.experiments({ optimizeLodash: true })]
                    });
                    const { plugins: webpackPlugins } = yield config_1.default(workspace);
                    const lodashPlugin = webpackPlugins.find(plugin => plugin.constructor === new LodashModuleReplacementPlugin().constructor);
                    expect(lodashPlugin).toBeUndefined();
                }));
                it('omits LodashModuleReplacementPlugin when it is not enabled', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode, target: 'client' }),
                        dependencies: utilities_1.createDependency('lodash'),
                        plugins: [plugins.vendors(['somePackage'])]
                    });
                    const { plugins: webpackPlugins } = yield config_1.default(workspace);
                    const lodashPlugin = webpackPlugins.find(plugin => plugin.constructor === new LodashModuleReplacementPlugin().constructor);
                    expect(lodashPlugin).toBeUndefined();
                }));
                it('includes LodashModuleReplacementPlugin when lodash is a dependency and the experiment is enabled', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode, target: 'client' }),
                        dependencies: utilities_1.createDependency('lodash'),
                        plugins: [plugins.vendors(['somePackage']), plugins.experiments({ optimizeLodash: true })]
                    });
                    const { plugins: webpackPlugins } = yield config_1.default(workspace);
                    const lodashPlugin = webpackPlugins.find(plugin => plugin.constructor === new LodashModuleReplacementPlugin().constructor);
                    expect(lodashPlugin).toBeDefined();
                }));
            });
            describe.each([['development'], ['test']])('%s', mode => {
                it('omits LodashModuleReplacementPlugin', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode }),
                        dependencies: utilities_1.createDependency('lodash'),
                        plugins: [plugins.vendors(['somePackage'])]
                    });
                    const { plugins: webpackPlugins } = yield config_1.default(workspace);
                    const lodashPlugin = webpackPlugins.find(plugin => plugin.constructor === new LodashModuleReplacementPlugin().constructor);
                    expect(lodashPlugin).toBeUndefined();
                }));
            });
        });
        describe('watch', () => {
            describe.each([['production'], ['staging'], ['test']])('%s', mode => {
                it('omits incremental compilation plugins', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(webpack_1.WatchIgnorePlugin, plugins)).toBe(false);
                }));
            });
            describe.each([['production'], ['staging']])('%s', mode => {
                it('catches invalid TypeScript exports', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(webpack_ignore_typescript_export_warnings_plugin_1.IgnoreTypeScriptExportWarnings, plugins)).toBe(false);
                }));
            });
            describe('development', () => {
                it('does not trigger recompilation when externally generated files change', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode: 'development' })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(webpack_1.WatchIgnorePlugin, plugins)).toBe(true);
                    expect(getPluginOfType(webpack_1.WatchIgnorePlugin, plugins)).toHaveProperty('paths', [/\.d\.ts$/]);
                }));
            });
            describe.each([['development'], ['test']])('%s', mode => {
                it('ignores invalid TypeScript export warnings caused by fast transpilation', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(webpack_ignore_typescript_export_warnings_plugin_1.IgnoreTypeScriptExportWarnings, plugins)).toBe(true);
                }));
            });
        });
        describe('styles', () => {
            describe.each([[new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'client' })]])('%s', env => {
                it('splits CSS into separate assets using MiniCssExtractPlugin', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({ env });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(MiniCssExtractPlugin, plugins)).toBe(true);
                    expect(getPluginOfType(MiniCssExtractPlugin, plugins).options).toMatchObject({
                        filename: '[name]-[contenthash].css',
                        chunkFilename: '[id]-[contenthash].css'
                    });
                }));
            });
            describe.each([[new env_1.default({ mode: 'development', target: 'client' })], [new env_1.default({ mode: 'development', target: 'server' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'staging', target: 'server' })], [new env_1.default({ mode: 'test', target: 'client' })], [new env_1.default({ mode: 'test', target: 'server' })]])('%s', env => {
                it('does not split CSS into separate .css files', () => __awaiter(_this, void 0, void 0, function* () {
                    const devClientWorkspace = utilities_1.createWorkspace({ env });
                    const { plugins: devClientPlugins } = yield config_1.default(devClientWorkspace);
                    expect(hasPluginOfType(MiniCssExtractPlugin, devClientPlugins)).toBe(false);
                    const serverWorkspace = utilities_1.createWorkspace({ env: server });
                    const { plugins: serverPlugins } = yield config_1.default(serverWorkspace);
                    expect(hasPluginOfType(MiniCssExtractPlugin, serverPlugins)).toBe(false);
                }));
            });
            describe('development client', () => {
                it('includes HappyPack for multi-threaded incremental compilation', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode: 'development', target: 'client' })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(Happypack, plugins)).toBe(true);
                    // eslint-disable-next-line no-warning-comments
                    // TODO: check more out about the plugin
                }));
            });
            describe.each([[new env_1.default({ mode: 'development', target: 'server' })], [new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'staging', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'server' })], [new env_1.default({ mode: 'test', target: 'client' })], [new env_1.default({ mode: 'test', target: 'server' })]])('%s', env => {
                it('omits HappyPack', () => __awaiter(_this, void 0, void 0, function* () {
                    const prodClientWorkspace = utilities_1.createWorkspace({ env });
                    const { plugins: prodClientPlugins } = yield config_1.default(prodClientWorkspace);
                    expect(hasPluginOfType(Happypack, prodClientPlugins)).toBe(false);
                    const serverWorkspace = utilities_1.createWorkspace({ env: server });
                    const { plugins: serverPlugins } = yield config_1.default(serverWorkspace);
                    expect(hasPluginOfType(Happypack, serverPlugins)).toBe(false);
                }));
            });
        });
        describe('report', () => {
            it('omits BundleAnalyzerPlugin by default', () => __awaiter(_this, void 0, void 0, function* () {
                const { plugins } = yield config_1.default(utilities_1.createWorkspace(), {
                    report: false
                });
                expect(hasPluginOfType(BundleAnalyzerPlugin, plugins)).toBe(false);
            }));
            it('omits BundleAnalyzerPlugin for server builds', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'server' })
                });
                const { plugins } = yield config_1.default(workspace, {
                    report: true
                });
                expect(hasPluginOfType(BundleAnalyzerPlugin, plugins)).toBe(false);
            }));
            it('includes BundleAnalyzerPlugin for client builds when report is requested', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'client' })
                });
                const { plugins } = yield config_1.default(workspace, {
                    report: true
                });
                expect(hasPluginOfType(BundleAnalyzerPlugin, plugins)).toBe(true);
                const plugin = getPluginOfType(BundleAnalyzerPlugin, plugins);
                expect(plugin).toHaveProperty('opts.analyzerMode', 'static');
                expect(plugin).toHaveProperty('opts.reportFilename', './bundle-analysis/report.html');
                expect(plugin).toHaveProperty('opts.statsFilename', './bundle-analysis/stats.json');
                expect(plugin).toHaveProperty('opts.generateStatsFile', false);
                expect(plugin).toHaveProperty('opts.openAnalyzer', false);
            }));
        });
        describe('output', () => {
            it('includes the NoEmitOnErrorsPlugin for development', () => __awaiter(_this, void 0, void 0, function* () {
                const { plugins: devPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development' })
                }));
                expect(hasPluginOfType(webpack_1.NoEmitOnErrorsPlugin, devPlugins)).toBe(true);
                const { plugins: prodPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production' })
                }));
                expect(hasPluginOfType(webpack_1.NoEmitOnErrorsPlugin, prodPlugins)).toBe(false);
            }));
            it('includes the LimitChunkCountPlugin for development servers', () => __awaiter(_this, void 0, void 0, function* () {
                const { plugins: devServerPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development', target: 'server' })
                }));
                expect(hasPluginOfType(LimitChunkCountPlugin, devServerPlugins)).toBe(true);
                expect(getPluginOfType(LimitChunkCountPlugin, devServerPlugins)).toHaveProperty('options.maxChunks', 1);
                const { plugins: prodServerPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'server' })
                }));
                expect(hasPluginOfType(LimitChunkCountPlugin, prodServerPlugins)).toBe(false);
                const { plugins: clientPlugins } = yield config_1.default(utilities_1.createWorkspace({ env: client }));
                expect(hasPluginOfType(LimitChunkCountPlugin, clientPlugins)).toBe(false);
            }));
            it('includes the HashOutputPlugin for production clients', () => __awaiter(_this, void 0, void 0, function* () {
                const { plugins: prodClientPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'client' })
                }));
                expect(hasPluginOfType(HashOutputPlugin, prodClientPlugins)).toBe(true);
                const { plugins: devClientPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development', target: 'client' })
                }));
                expect(hasPluginOfType(HashOutputPlugin, devClientPlugins)).toBe(false);
                const { plugins: serverPlugins } = yield config_1.default(utilities_1.createWorkspace({ env: server }));
                expect(hasPluginOfType(HashOutputPlugin, serverPlugins)).toBe(false);
            }));
            it('fails production client builds that remove modules unexpectedly', () => __awaiter(_this, void 0, void 0, function* () {
                const { plugins: prodClientPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'client' })
                }));
                expect(hasPluginOfType(fail_on_unexpected_module_shaking_plugin_1.FailOnUnexpectedModuleShakingPlugin, prodClientPlugins)).toBe(true);
                const { plugins: devClientPlugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development', target: 'client' })
                }));
                expect(hasPluginOfType(fail_on_unexpected_module_shaking_plugin_1.FailOnUnexpectedModuleShakingPlugin, devClientPlugins)).toBe(false);
                const { plugins: serverPlugins } = yield config_1.default(utilities_1.createWorkspace({ env: server }));
                expect(hasPluginOfType(fail_on_unexpected_module_shaking_plugin_1.FailOnUnexpectedModuleShakingPlugin, serverPlugins)).toBe(false);
            }));
            it('defaults to failing on all unexpected side-effect treeshaking', () => __awaiter(_this, void 0, void 0, function* () {
                const { plugins } = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'client' })
                }));
                const plugin = getPluginOfType(fail_on_unexpected_module_shaking_plugin_1.FailOnUnexpectedModuleShakingPlugin, plugins);
                expect(plugin).toHaveProperty('options.exclude', []);
            }));
            describe('CompressionPlugin', () => {
                it('includes compression-webpack-plugin for Rails assets in production', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        isRails: true,
                        env: new env_1.default({ mode: 'production', target: 'client' })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(CompressionPlugin, plugins)).toBe(true);
                }));
                it('omits compression-webpack-plugin for Rails assets in development', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        isRails: true,
                        env: new env_1.default({ mode: 'development', target: 'client' })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(CompressionPlugin, plugins)).toBe(false);
                }));
                it('omits compression-webpack-plugin for Node assets in production', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode: 'production', target: 'client' })
                    });
                    const { plugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(CompressionPlugin, plugins)).toBe(false);
                }));
            });
        });
        describe('manifests', () => {
            describe('AssetMetaDataPlugin', () => {
                it('points to assets.json in the target build directory for Node', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({ env: client });
                    const config = yield config_1.default(workspace);
                    const { plugins } = config;
                    expect(hasPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, plugins)).toBe(true);
                    const assetsPlugin = getPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, plugins);
                    expect(assetsPlugin).toHaveProperty('options.filename', 'assets.json');
                }));
                it('points to sewing-kit-manifest.json in the build directory for Rails', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({ isRails: true });
                    const config = yield config_1.default(workspace);
                    const { plugins } = config;
                    expect(hasPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, plugins)).toBe(true);
                    const assetsPlugin = getPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, plugins);
                    expect(assetsPlugin).toHaveProperty('options.filename', 'sewing-kit-manifest.json');
                }));
                it('outputs production Rails assets relative to shopify-cloud`s asset upload dir', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        isRails: true,
                        env: new env_1.default({ target: 'client', mode: 'production' })
                    });
                    const config = yield config_1.default(workspace);
                    const { plugins } = config;
                    expect(hasPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, plugins)).toBe(true);
                    const assetsPlugin = getPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, plugins);
                    expect(assetsPlugin).toHaveProperty('options.assetBasePath', path.join(workspace.paths.root, 'public'));
                }));
                it('uses a custom manifest file name', () => __awaiter(_this, void 0, void 0, function* () {
                    const filename = 'my-custom-manifest-file.json';
                    const workspace = utilities_1.createWorkspace({
                        plugins: [plugins.manifest(filename)]
                    });
                    const { plugins: webpackPlugins } = yield config_1.default(workspace);
                    expect(hasPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, webpackPlugins)).toBe(true);
                    expect(getPluginOfType(webpack_asset_metadata_plugin_1.AssetMetadataPlugin, webpackPlugins)).toHaveProperty('options.filename', filename);
                }));
            });
            describe('AsyncChunksPlugin', () => {
                const pluginConfig = [plugins.experiments({ asyncChunks: true })];
                describe.each([['production'], ['staging']])('%s', mode => {
                    it('is included on client builds', () => __awaiter(_this, void 0, void 0, function* () {
                        const plugin = webpack_plugin_1.AsyncChunksPlugin;
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ target: 'client', mode }),
                            plugins: pluginConfig
                        }));
                        expect(hasPluginOfType(plugin, config.plugins)).toBe(true);
                    }));
                });
                it('is omitted for server builds ', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: server,
                        plugins: pluginConfig
                    });
                    const config = yield config_1.default(workspace);
                    expect(hasPluginOfType(webpack_plugin_1.AsyncChunksPlugin, config.plugins)).toBe(false);
                }));
                it('is omitted for rails projects', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        isRails: true,
                        env: new env_1.default({ target: 'client', mode: 'production' }),
                        plugins: pluginConfig
                    });
                    const config = yield config_1.default(workspace);
                    const { plugins } = config;
                    expect(hasPluginOfType(webpack_plugin_1.AsyncChunksPlugin, plugins)).toBe(false);
                }));
                describe('development', () => {
                    it('is included on for client builds', () => __awaiter(_this, void 0, void 0, function* () {
                        const plugin = webpack_plugin_1.AsyncChunksPlugin;
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ target: 'client', mode: 'development' }),
                            plugins: pluginConfig
                        }));
                        expect(hasPluginOfType(plugin, config.plugins)).toBe(true);
                    }));
                });
                it('is omitted for server builds', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ target: 'server', mode: 'development' }),
                        plugins: [plugins.experiments({ asyncChunks: true })]
                    });
                    const config = yield config_1.default(workspace);
                    expect(hasPluginOfType(webpack_plugin_1.AsyncChunksPlugin, config.plugins)).toBe(false);
                }));
                it('does not produce async-chunks manifest for rails projects', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        isRails: true,
                        env: new env_1.default({ target: 'client', mode: 'development' }),
                        plugins: pluginConfig
                    });
                    const config = yield config_1.default(workspace);
                    const { plugins } = config;
                    expect(hasPluginOfType(webpack_plugin_1.AsyncChunksPlugin, plugins)).toBe(false);
                }));
            });
        });
        describe('build caching', () => {
            describe('without fastStartup', () => {
                [development, test, production].forEach(env => {
                    it(`omits hard-source plugin in ${env.mode}`, () => __awaiter(_this, void 0, void 0, function* () {
                        const workspace = utilities_1.createWorkspace({
                            env,
                            plugins: []
                        });
                        const { plugins: webpackPlugins } = yield config_1.default(workspace);
                        expect(hasPluginOfType(HardSourcePlugin, webpackPlugins)).toBe(false);
                    }));
                });
            });
            describe('with fastStartup', () => {
                [development, test, production].forEach(env => {
                    it(`includes hard-source plugin in ${env.mode}`, () => __awaiter(_this, void 0, void 0, function* () {
                        const workspace = utilities_1.createWorkspace({
                            env,
                            plugins: [plugins.experiments({ fastStartup: true })]
                        });
                        const { plugins: webpackPlugins } = yield config_1.default(workspace);
                        expect(hasPluginOfType(HardSourcePlugin, webpackPlugins)).toBe(true);
                    }));
                });
            });
            it('includes a hard-source plugin scoped to the target', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development', target: 'server' }),
                    plugins: [plugins.experiments({ fastStartup: true })]
                });
                const { plugins: webpackPlugins } = yield config_1.default(workspace);
                expect(hasPluginOfType(HardSourcePlugin, webpackPlugins)).toBe(true);
                const plugin = getPluginOfType(HardSourcePlugin, webpackPlugins);
                expect(plugin).toHaveProperty('options.cacheDirectory', path.join(workspace.paths.cache, 'webpack', 'hard-source', 'development-server-[confighash]'));
                expect(typeof plugin.options.configHash).toBe('function');
            }));
        });
    });
});