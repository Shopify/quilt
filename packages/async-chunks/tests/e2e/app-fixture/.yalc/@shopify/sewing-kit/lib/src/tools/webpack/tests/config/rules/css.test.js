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
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../../env");
const config_1 = require("../../../config");
describe('webpackConfig()', () => {
    describe('rules', () => {
        describe('css', () => {
            function findCSSLoaders({ module: { rules } }, loaderName) {
                const scssRules = rules.filter(rule => rule.test != null && rule.test instanceof RegExp && rule.test.source === /\.scss$/.source);
                return scssRules.map(rule => Array.isArray(rule.use) && rule.use).map(loaders => loaders.find(loader => loader.loader === loaderName));
            }
            describe.each([['production'], ['staging']])('%s', mode => {
                it('minifies CSS', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode })
                    });
                    const config = yield config_1.default(workspace);
                    const cssLoaders = findCSSLoaders(config, 'css-loader');
                    expect(cssLoaders).toHaveLength(1);
                    expect(cssLoaders[0].options).toMatchObject({
                        minimize: true,
                        localIdentName: '[hash:base64:5]'
                    });
                }));
                it('minifies Polaris CSS', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode }),
                        dependencies: utilities_1.createDependency('@shopify/polaris')
                    });
                    const config = yield config_1.default(workspace);
                    const cssLoaders = findCSSLoaders(config, 'css-loader');
                    expect(cssLoaders).toHaveLength(2);
                    expect(cssLoaders[0].options).toMatchObject({
                        minimize: true,
                        localIdentName: 'p_[hash:base64:5]'
                    });
                    const sassLoaders = findCSSLoaders(config, 'sass-resources-loader');
                    expect(sassLoaders).toHaveLength(2);
                    expect(sassLoaders).toHaveProperty('0.options.resources.0', expect.stringMatching(/node_modules\/@shopify\/polaris\/esnext\/styles\/foundation.scss/));
                }));
                it('generates source maps by default', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode }),
                        dependencies: utilities_1.createDependency('@shopify/polaris')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'fast' });
                    const cssLoaders = findCSSLoaders(config, 'css-loader');
                    expect(cssLoaders).toHaveLength(2);
                    expect(cssLoaders[0].options.sourceMap).toBe(true);
                    expect(cssLoaders[1].options.sourceMap).toBe(true);
                }));
                it('omits source maps when source maps are disabled', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode }),
                        dependencies: utilities_1.createDependency('@shopify/polaris')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const cssLoaders = findCSSLoaders(config, 'css-loader');
                    expect(cssLoaders).toHaveLength(2);
                    expect(cssLoaders[0].options.sourceMap).toBe(false);
                    expect(cssLoaders[1].options.sourceMap).toBe(false);
                }));
            });
            describe('server', () => {
                describe.each([['production'], ['staging']])('%s', mode => {
                    it('minifies CSS', () => __awaiter(_this, void 0, void 0, function* () {
                        const workspace = utilities_1.createWorkspace({
                            env: new env_1.default({ target: 'server', mode })
                        });
                        const config = yield config_1.default(workspace);
                        const cssLoaders = findCSSLoaders(config, 'css-loader/locals');
                        expect(cssLoaders).toHaveLength(1);
                        expect(cssLoaders).toHaveProperty('0.options.localIdentName', '[hash:base64:5]');
                    }));
                    it('minifies Polaris CSS in production', () => __awaiter(_this, void 0, void 0, function* () {
                        const workspace = utilities_1.createWorkspace({
                            env: new env_1.default({ target: 'server', mode }),
                            dependencies: utilities_1.createDependency('@shopify/polaris')
                        });
                        const config = yield config_1.default(workspace);
                        const cssLoaders = findCSSLoaders(config, 'css-loader/locals');
                        expect(cssLoaders).toHaveLength(2);
                        expect(cssLoaders).toHaveProperty('0.options.localIdentName', 'p_[hash:base64:5]');
                    }));
                });
                describe.each([['development'], ['test']])('%s', mode => {
                    it('generates un-hardcodeable but human-readable class names', () => __awaiter(_this, void 0, void 0, function* () {
                        const workspace = utilities_1.createWorkspace({
                            env: new env_1.default({ target: 'server', mode })
                        });
                        const config = yield config_1.default(workspace);
                        const cssLoaders = findCSSLoaders(config, 'css-loader/locals');
                        expect(cssLoaders).toHaveProperty('0.options.localIdentName', '[name]-[local]_[hash:base64:5]');
                    }));
                    it('uses prebuilt Polaris class names', () => __awaiter(_this, void 0, void 0, function* () {
                        const workspace = utilities_1.createWorkspace({
                            env: new env_1.default({ target: 'server', mode }),
                            dependencies: utilities_1.createDependency('@shopify/polaris')
                        });
                        const config = yield config_1.default(workspace);
                        const cssLoaders = findCSSLoaders(config, 'css-loader/locals');
                        expect(cssLoaders).toHaveLength(2);
                        expect(cssLoaders[0].options).toMatchObject({
                            localIdentName: '[local]'
                        });
                    }));
                });
            });
        });
    });
});