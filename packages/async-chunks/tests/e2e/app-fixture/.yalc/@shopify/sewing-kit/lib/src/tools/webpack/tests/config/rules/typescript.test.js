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
const env_1 = require("../../../../../env");
const config_1 = require("../../../config");
describe('webpackConfig()', () => {
    describe('rules', () => {
        describe('typescript', () => {
            function findTypeScriptRule({ module: { rules } }) {
                return rules.find(rule => rule.test != null && rule.test instanceof RegExp && rule.test.source === /\.tsx?$/.source && rule.use && Array.isArray(rule.use) && rule.use.find(use => {
                    return typeof use === 'object' && use.loader === 'babel-loader';
                }));
            }
            describe.each([[new env_1.default({ mode: 'development', target: 'client' })], [new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'client' })], [new env_1.default({ mode: 'test', target: 'client' })], [new env_1.default({ mode: 'development', target: 'server' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'staging', target: 'server' })], [new env_1.default({ mode: 'test', target: 'server' })]])('%s', env => {
                it('excludes node_modules', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript'),
                        dependencies: utilities_1.createDependency('@shopify/polaris')
                    }));
                    const rule = findTypeScriptRule(config);
                    expect(rule).toHaveProperty('exclude', /node_modules/);
                }));
            });
            describe.each([[new env_1.default({ mode: 'development', target: 'client' })], [new env_1.default({ mode: 'test', target: 'client' })], [new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'client' })]])('%s', env => {
                it(`uses babel web preset`, () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const rule = findTypeScriptRule(config);
                    expect(rule).toHaveProperty('use.0.options');
                    expect(rule.use[0].options).toMatchObject({
                        presets: [[path.join(workspace.paths.nodeModules, 'babel-preset-shopify', 'web.js'), { modules: false }]]
                    });
                }));
            });
            describe.each([[new env_1.default({ mode: 'development', target: 'server' })], [new env_1.default({ mode: 'test', target: 'server' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'staging', target: 'server' })]])('%s', env => {
                it('uses babel node preset', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const rule = findTypeScriptRule(config);
                    expect(rule).toHaveProperty('use.0.options');
                    expect(rule.use[0].options).toMatchObject({
                        presets: [[path.join(workspace.paths.nodeModules, 'babel-preset-shopify', 'node.js'), { modules: false }]]
                    });
                }));
            });
            describe.each([[new env_1.default({ mode: 'development', target: 'client' })], [new env_1.default({ mode: 'development', target: 'server' })], [new env_1.default({ mode: 'test', target: 'client' })], [new env_1.default({ mode: 'test', target: 'server' })]])('%s', env => {
                function findTypeScriptLoader(config) {
                    const rule = findTypeScriptRule(config);
                    if (!rule) {
                        return undefined;
                    }
                    return rule.use.find(loader => loader.loader === 'ts-loader');
                }
                it('omits rule when TypeScript is not a project dev dependency', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({
                        env,
                        dependencies: utilities_1.createDependency('@shopify/polaris')
                    }));
                    const rule = findTypeScriptRule(config);
                    expect(rule).toBeUndefined();
                }));
                it('uses fast compilation options', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace);
                    const loader = findTypeScriptLoader(config);
                    expect(loader).not.toBeUndefined();
                    expect(loader).toHaveProperty('options', {
                        happyPackMode: true,
                        silent: true,
                        transpileOnly: true,
                        compilerOptions: {
                            noEmit: false,
                            skipLibCheck: true,
                            skipDefaultLibCheck: true,
                            strict: false,
                            strictFunctionTypes: false,
                            strictNullChecks: false,
                            sourceMap: true
                        }
                    });
                }));
                it('disables source maps when requested', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const loader = findTypeScriptLoader(config);
                    expect(loader).not.toBeUndefined();
                    expect(loader).toHaveProperty('options.compilerOptions.sourceMap', false);
                }));
                it('improves cold server startup by caching client TypeScript transpilation', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const rule = findTypeScriptRule(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule).toHaveProperty('use.1.loader', 'cache-loader');
                    expect(rule.use[1].options).toHaveProperty('cacheDirectory', path.join(workspace.paths.cache, 'webpack', `ts-loader-${env.mode}`, `fake_node_modules_hash`));
                }));
                it('transpiles JavaScript separately to allow custom Babel environment', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const rule = findTypeScriptRule(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule).toHaveProperty('use.0.loader', 'babel-loader');
                    expect(rule.use[0].options).toMatchObject({
                        babelrc: false,
                        cacheDirectory: path.join(workspace.paths.cache, `webpack/ts-babel-loader-${env.mode}-${env.target}`),
                        cacheIdentifier: expect.stringMatching(/fake_node_modules_hash-[a-f0-9]+/),
                        forceEnv: env.mode,
                        plugins: []
                    });
                }));
            });
            describe.each([[new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'staging', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'server' })]])('%s', env => {
                it('type checks to eliminate all dead code', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace);
                    const rule = findTypeScriptRule(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule).toHaveProperty('use.1.loader', 'awesome-typescript-loader');
                    expect(rule.use[1]).toMatchObject({
                        options: {
                            silent: true,
                            transpileOnly: false,
                            compiler: path.join(workspace.paths.nodeModules, 'typescript')
                        }
                    });
                }));
                it('caches TypeScript transpilation to speed up rebuilds', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const rule = findTypeScriptRule(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule).toHaveProperty('use.1.loader', 'awesome-typescript-loader');
                    expect(rule.use[1]).toMatchObject({
                        options: {
                            cacheDirectory: path.join(workspace.paths.cache, 'webpack', `at-loader-${env.mode}`, 'fake_node_modules_hash'),
                            useCache: true
                        }
                    });
                }));
                it('transpiles JavaScript separately to set production Babel environment', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env,
                        devDependencies: utilities_1.createDependency('typescript')
                    });
                    const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                    const rule = findTypeScriptRule(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule).toHaveProperty('use.0.loader', 'babel-loader');
                    expect(rule).toHaveProperty('use.1.loader', 'awesome-typescript-loader');
                    expect(rule.use[1].options).toHaveProperty('useBabel', false);
                    expect(rule.use[0].options).toMatchObject({
                        babelrc: false,
                        cacheDirectory: path.join(workspace.paths.cache, `webpack/ts-babel-loader-${env.mode}-${env.target}`),
                        cacheIdentifier: expect.stringMatching(/fake_node_modules_hash-[a-f0-9]+/),
                        forceEnv: 'production',
                        plugins: []
                    });
                }));
            });
        });
    });
});