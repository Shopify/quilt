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
const plugins = require("../../../../../plugins");
const config_1 = require("../../../config");
const server = new env_1.default({ target: 'server' });
const client = new env_1.default({ target: 'client' });
const development = new env_1.default({ mode: 'development' });
describe('webpackConfig()', () => {
    describe('rules', () => {
        function findJavaScriptRules({ module: { rules } }) {
            return rules.filter(rule => rule.test instanceof RegExp && rule.test.source === /\.jsx?$/.source && rule.loader === 'babel-loader');
        }
        describe('javascript', () => {
            it('transpiles JS by default', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).not.toBeUndefined();
                expect(rule.test.source).toEqual(/\.jsx?$/.source);
            }));
            it('transpiles JSX in React projects', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    dependencies: utilities_1.createDependency('react')
                });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).not.toBeUndefined();
                expect(rule.test.source).toBe(/\.jsx?$/.source);
            }));
            it('transpiles JSX in Preact projects', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    dependencies: utilities_1.createDependency('preact')
                });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).not.toBeUndefined();
                expect(rule.test.source).toBe(/\.jsx?$/.source);
            }));
            it('adds a JavaScript rule even when TypeScript is a dependency', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    devDependencies: utilities_1.createDependency('typescript')
                }));
                const rule = findJavaScriptRules(config)[0];
                expect(rule).not.toBeUndefined();
            }));
            it('caches transpiled JS', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'client' })
                });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).toHaveProperty('options.cacheDirectory');
                expect(rule.options.cacheDirectory).toEqual(path.join(workspace.paths.cache, 'webpack', 'babel-loader-production-client'));
            }));
            it('sets a Babel environment', () => __awaiter(_this, void 0, void 0, function* () {
                const productionWorkspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'production', target: 'client' })
                });
                const productionConfig = yield config_1.default(productionWorkspace);
                const productionRule = findJavaScriptRules(productionConfig)[0];
                expect(productionRule.options.forceEnv).toEqual('production');
                const devWorkspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development', target: 'client' })
                });
                const devConfig = yield config_1.default(devWorkspace);
                const devRule = findJavaScriptRules(devConfig)[0];
                expect(devRule.options.forceEnv).toEqual('development');
            }));
            it('excludes node_modules and build in non-production environments', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env: development });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).not.toBeUndefined();
                expect(rule).toHaveProperty('exclude', [/node_modules/, workspace.paths.build]);
            }));
            it('uses the web Babel preset for the client', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env: client });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).toHaveProperty('options.presets.0', [require.resolve('babel-preset-shopify/web'), { modules: false }]);
            }));
            it('uses the Node Babel preset for the server', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env: server });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).toHaveProperty('options.presets.0', [require.resolve('babel-preset-shopify/node'), { modules: false }]);
            }));
            it('uses the React Babel preset when React is present', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: server,
                    dependencies: utilities_1.createDependency('react')
                });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).toHaveProperty('options.presets.1', require.resolve('babel-preset-shopify/react'));
            }));
            it('uses the React Babel preset with custom pragma when Preact is present', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: server,
                    dependencies: utilities_1.createDependency('preact')
                });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).toHaveProperty('options.presets.1', [require.resolve('babel-preset-shopify/react'), { pragma: 'h' }]);
            }));
            it('enables HMR for client React Babel presets', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    dependencies: utilities_1.createDependency('react')
                });
                const config = yield config_1.default(workspace);
                const rule = findJavaScriptRules(config)[0];
                expect(rule).toHaveProperty('options.presets.1', [require.resolve('babel-preset-shopify/react'), { hot: true }]);
            }));
            describe('polaris', () => {
                it('uses prebuilt polaris in development', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({
                        env: development,
                        dependencies: utilities_1.createDependency('@shopify/polaris')
                    }));
                    const rules = findJavaScriptRules(config);
                    expect(rules).toHaveLength(1);
                    expect(rules[0]).toMatchObject({
                        exclude: expect.arrayContaining([/node_modules/])
                    });
                }));
                it.each([['production'], ['staging']])('builds from source in %s', mode => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ target: 'client', mode }),
                        dependencies: utilities_1.createDependency('@shopify/polaris'),
                        nodeModulesHash: 'fake_node_modules_hash'
                    });
                    const config = yield config_1.default(workspace);
                    const rules = findJavaScriptRules(config);
                    expect(rules).toHaveLength(2);
                    expect(rules[1]).toHaveProperty('include', /node_modules\/@shopify\/polaris\/esnext(\/|$)/);
                    expect(rules[1]).toMatchObject({
                        options: {
                            cacheDirectory: path.join(workspace.paths.cache, 'webpack', `babel-loader-polaris-${mode}-client`),
                            cacheIdentifier: expect.stringMatching(`fake_node_modules_hash-`)
                        }
                    });
                }));
                /*
                 * Polaris source is built using a non-standard environment because:
                 * - It disables `production` Babel transforms
                 * - ... necessary because constant hoisting causes cyclical dependencies in indexed-based imports
                 * - Using falsy values occassionally causes `development` to be used ¯\_(ツ)_/¯
                 *
                 * RE cyclical imports.  Say you have `components/index.js`:
                 * ```js
                 *   import foo from './foo';
                 *   import bar from './bar'; // <-- note that bar is evaluated *after* foo.
                 * ```
                 *
                 * And foo imports bar from `components/index.js`
                 * ```js
                 *   import bar from '.';
                 *
                 *   export default function render() { return <bar /> }
                 * ```
                 *
                 * By default, webpack will generate something like this for `foo.js`:
                 * ```js
                 *   var __components_WEBPACK_IMPORTED_MODULE_1 = __webpack_require__(1);
                 *
                 *   exports = function render() {
                 *     // Note that this will always be processed *after* webpack has fully evaluated all modules.
                 *     return React.createElement('div', null, __components_WEBPACK_IMPORTED_MODULE_1['bar']);
                 *   }
                 * ```
                 *
                 * However, if `babel-plugin-transform-react-constant-elements` hoists bar.js, generated code looks like:
                 * ```js
                 *   var __components_WEBPACK_IMPORTED_MODULE_1 = __webpack_require__(1);
                 *
                 *   // Note that this will be processed while webpack is still evaluating modules.
                 *   var _ref = React.createElement('div', null, __components_WEBPACK_IMPORTED_MODULE_1['bar']);
                 *
                 *   exports = function render() { return _ref; }
                 * ```
                 *
                 * In the non-hoisted version, webpack has this import behaviour:
                 *   - Process `components/index.js`
                 *     - At this point, a webpack import for `components/index.js` exists, but is empty
                 *     - Process './foo'
                 *       - foo's `bar` import is processed, but it's just a reference to the empty `components/index.js` placeholder!
                 *     - Process './bar'
                 *     - The webpack import for `components/index.js` now contains `foo` and `bar` modules
                 *
                 * The problem with the hoisted version is that webpack has this import behaviour:
                 *   - Process `components/index.js`
                 *     - At this point, a webpack import for `components/index.js` exists, but is empty
                 *     - Process './foo'
                 *       - foo's `bar` import is processed, but it's just a reference to the empty `components/index.js` placeholder!
                 *       - The hoisted `createElement` call looks for a `bar` import and fails because it's undefined
                 */
                it.each([['production'], ['staging']])('forces unknown Babel env to avoid cyclical dependencies caused by babel-plugin-transform-react-constant-elements in %s', mode => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        env: new env_1.default({ mode, target: 'client' }),
                        dependencies: utilities_1.createDependency('@shopify/polaris')
                    });
                    const config = yield config_1.default(workspace);
                    const rules = findJavaScriptRules(config);
                    expect(rules).toHaveLength(2);
                    expect(rules[1].options).toHaveProperty('forceEnv', 'lol');
                }));
            });
            describe('lodash', () => {
                describe('production', () => {
                    it('includes babel-plugin-lodash', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ mode: 'production', target: 'client' }),
                            dependencies: utilities_1.createDependency('lodash'),
                            plugins: [plugins.vendors(['somePackage'])]
                        }));
                        const rule = findJavaScriptRules(config)[0];
                        expect(rule.options.plugins).toContain('lodash');
                    }));
                });
                describe('development', () => {
                    it('omits babel-plugin-lodash', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ mode: 'development' }),
                            dependencies: utilities_1.createDependency('lodash'),
                            plugins: [plugins.vendors(['somePackage'])]
                        }));
                        const rule = findJavaScriptRules(config)[0];
                        expect(rule.options.plugins).not.toContain('lodash');
                    }));
                });
            });
            describe('@shopify/async-chunks', () => {
                describe.each([['production'], ['staging']])('%s', mode => {
                    it('includes @shopify/async-chunks/babel on the client', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ mode, target: 'client' }),
                            plugins: [plugins.experiments({ asyncChunks: true })]
                        }));
                        const rule = findJavaScriptRules(config)[0];
                        expect(rule.options.plugins).toContain('@shopify/async-chunks/babel');
                    }));
                    it('includes @shopify/async-chunks/babel on the server', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ mode, target: 'server' }),
                            plugins: [plugins.experiments({ asyncChunks: true })]
                        }));
                        const rule = findJavaScriptRules(config)[0];
                        expect(rule.options.plugins).toContain('@shopify/async-chunks/babel');
                    }));
                    it('omits @shopify/async-chunks/babel by default', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ mode, target: 'server' })
                        }));
                        const rule = findJavaScriptRules(config)[0];
                        expect(rule.options.plugins).not.toContain('@shopify/async-chunks/babel');
                    }));
                });
                describe('development', () => {
                    it('omits babel-plugin-lodash', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: development,
                            dependencies: utilities_1.createDependency('lodash'),
                            plugins: [plugins.vendors(['somePackage'])]
                        }));
                        const rule = findJavaScriptRules(config)[0];
                        expect(rule.options.plugins).not.toContain('lodash');
                    }));
                    it('omits @shopify/async-chunks/babel by default', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({
                            env: new env_1.default({ mode: 'development', target: 'server' })
                        }));
                        const rule = findJavaScriptRules(config)[0];
                        expect(rule.options.plugins).not.toContain('@shopify/async-chunks/babel');
                    }));
                });
            });
        });
    });
});