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
const fs = require("fs-extra");
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../env");
const plugins = require("../../../../plugins");
const config_1 = require("../../config");
const client = new env_1.default({ target: 'client' });
describe('webpackConfig()', () => {
    describe('externals', () => {
        // We basically have to recreate Webpack's externals check, which
        function externalName(externals, aModule) {
            return __awaiter(this, void 0, void 0, function* () {
                const finalExternals = Array.isArray(externals) ? externals : [externals];
                for (const external of finalExternals) {
                    if (typeof external === 'string') {
                        return aModule === external ? aModule : null;
                    } else if (external instanceof RegExp) {
                        return external.test(aModule) ? aModule : null;
                    } else if (typeof external === 'object') {
                        const value = external[aModule];
                        if (value == null) {
                            return null;
                        }
                        return typeof value === 'boolean' ? aModule : value;
                    } else {
                        return new Promise(resolve => {
                            // We return an array of
                            // The externals function returned by webpack-node-externals takes a
                            // context parameter, a module name, and a callback. If the module is
                            // external, the callback is called with no error and a custom name. If
                            // it is not external, the callback is called with nothing.
                            return external({}, aModule, (_, name) => {
                                resolve(name || null);
                            });
                        });
                    }
                }
                return null;
            });
        }
        function isExternal(externals, aModule) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield externalName(externals, aModule)) != null;
            });
        }
        it('has no externals on the client by default', () => __awaiter(_this, void 0, void 0, function* () {
            const config = yield config_1.default(utilities_1.createWorkspace({ env: client }));
            expect(config).not.toHaveProperty('externals');
        }));
        describe('server', () => {
            beforeEach(() => fs.mkdirp('node_modules/@shopify/polaris'));
            afterEach(() => fs.rmdir('node_modules/@shopify/polaris'));
            it('has externals that includes everything but source-map-support for servers', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode: 'development' })
                }));
                expect(config).toHaveProperty('externals');
                expect((yield isExternal(config.externals, 'webpack'))).toBe(true);
                expect((yield isExternal(config.externals, 'source-map-support/register'))).toBe(false);
            }));
            it('uses prebuilt Polaris as an external in dev servers', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode: 'development' })
                }));
                // using webpack-node-externals prepends the module format, which we have to account for here
                expect((yield externalName(config.externals, '@shopify/polaris'))).toBe('commonjs @shopify/polaris');
            }));
            it.each([['production'], ['staging']])('builds %s servers from the ESNext Polaris source', mode => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode })
                }));
                expect((yield externalName(config.externals, '@shopify/polaris'))).toBeNull();
            }));
        });
        it('uses custom externals provided by a plugin', () => __awaiter(_this, void 0, void 0, function* () {
            const externals = { foo: 'window.Foo', bar: 'window.Bar' };
            const config = yield config_1.default(utilities_1.createWorkspace({
                plugins: [plugins.externals(externals)]
            }));
            expect(config).toHaveProperty('externals', externals);
        }));
    });
});