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
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../env");
const config_1 = require("../../config");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
describe('webpackConfig()', () => {
    describe('optimization', () => {
        it('uses development defaults for development/test builds', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace({
                env: new env_1.default({ mode: 'development', target: 'client' })
            })))).not.toHaveProperty('optimization');
            expect((yield config_1.default(utilities_1.createWorkspace({
                env: new env_1.default({ mode: 'development', target: 'server' })
            })))).not.toHaveProperty('optimization');
            expect((yield config_1.default(utilities_1.createWorkspace({
                env: new env_1.default({ mode: 'test', target: 'client' })
            })))).not.toHaveProperty('optimization');
        }));
        describe.each([['production'], ['staging']])('%s', mode => {
            it('uglifies client JavaScript', () => __awaiter(_this, void 0, void 0, function* () {
                yield utilities_1.withEnv({ CIRCLECI: undefined, SHOPIFY_BUILD_VERSION: undefined }, () => __awaiter(this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode, target: 'client' })
                    });
                    const config = yield config_1.default(workspace);
                    expect(config).toHaveProperty('optimization');
                    expect(config.optimization).toMatchObject({
                        minimize: true,
                        minimizer: expect.arrayContaining([expect.any(UglifyJSPlugin)])
                    });
                    const uglifyPlugin = config.optimization.minimizer[0];
                    expect(uglifyPlugin.options).toMatchObject({
                        cache: path.join(workspace.paths.cache, 'webpack', 'uglify'),
                        parallel: true,
                        sourceMap: true,
                        uglifyOptions: {
                            ecma: 5,
                            warnings: false,
                            compress: true,
                            ie8: false,
                            safari10: true,
                            mangle: {
                                safari10: true
                            },
                            output: {
                                ecma: 5
                            }
                        }
                    });
                }));
            }));
            it('disables source maps when requested', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'client' })
                });
                const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                expect(config).toHaveProperty('optimization.minimizer.0');
                const uglifyPlugin = config.optimization.minimizer[0];
                expect(uglifyPlugin.options).toHaveProperty('sourceMap', false);
            }));
            it('uses human-readable chunk/module names for consistent file caching', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'client' })
                }));
                expect(config.optimization).toMatchObject({
                    namedChunks: true,
                    namedModules: true
                });
            }));
            it('shares webpack bootstrap code between entrypoints via a single runtime chunk', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'client' })
                }));
                expect(config.optimization).toHaveProperty('runtimeChunk', 'single');
            }));
            it('shares code between entrypoint/async chunks', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'client' })
                }));
                expect(config.optimization).toHaveProperty('splitChunks.chunks', 'all');
            }));
            it('prefers code sharing via many http/2 downloads over duplication in large bundles', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'client' })
                }));
                expect(config.optimization).toHaveProperty('splitChunks.maxAsyncRequests', 10);
            }));
            it('concatenates modules for smaller files', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'client' })
                }));
                expect(config.optimization).toHaveProperty('concatenateModules', true);
            }));
            it('limits parallel CPU load in CircleCI', () => __awaiter(_this, void 0, void 0, function* () {
                yield utilities_1.withEnv({ CIRCLECI: 'true' }, () => __awaiter(this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({
                        env: new env_1.default({ mode, target: 'client' })
                    }));
                    const uglifyPlugin = config.optimization.minimizer[0];
                    expect(uglifyPlugin).toHaveProperty('options.parallel', 3);
                }));
            }));
            it('limits parallel CPU load in shopify-build', () => __awaiter(_this, void 0, void 0, function* () {
                process.env.SHOPIFY_BUILD_VERSION = '1';
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'client' })
                }));
                const uglifyPlugin = config.optimization.minimizer[0];
                expect(uglifyPlugin).toHaveProperty('options.parallel', 3);
            }));
            it('skips server optimizations for faster builds', () => __awaiter(_this, void 0, void 0, function* () {
                expect((yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ mode, target: 'server' })
                })))).toHaveProperty('optimization', {
                    concatenateModules: false,
                    minimize: false,
                    namedChunks: true,
                    namedModules: true,
                    runtimeChunk: false,
                    splitChunks: false,
                    sideEffects: false
                });
            }));
        });
    });
});