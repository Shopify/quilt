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
const env_1 = require("../../../../env");
const config_1 = require("../../config");
const development = new env_1.default({ mode: 'development' });
describe('webpackConfig()', () => {
    describe('devtool', () => {
        describe.each([['production'], ['staging']])('%s', mode => {
            it('uses the source-map devtool for servers', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('devtool', 'source-map');
            }));
            it('ignores sourceMap option for servers', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode })
                });
                const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                expect(config).toHaveProperty('devtool', 'source-map');
            }));
            it('uses the hidden-source-map devtool for clients', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('devtool', 'hidden-source-map');
            }));
        });
        describe('development', () => {
            it('uses the hidden-source-map devtool for servers', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode: 'development' })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('devtool', 'hidden-source-map');
            }));
            it('uses no devtool for servers when sourceMaps are explicitly turned off', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode: 'development' })
                });
                const config = yield config_1.default(workspace, { sourceMaps: 'off' });
                expect(config).toHaveProperty('devtool', undefined);
            }));
            it('uses the source-map devtool when accurate source maps are requested for clients', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development' })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('devtool', 'source-map');
            }));
            it('uses the eval devtool when fast source maps are requested for clients', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development' })
                });
                expect((yield config_1.default(workspace, { sourceMaps: 'fast' }))).toHaveProperty('devtool', 'eval');
            }));
            it('uses no devtool for clients when sourceMaps are explicitly turned off', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ mode: 'development' })
                });
                expect((yield config_1.default(workspace, { sourceMaps: 'off' }))).toHaveProperty('devtool', undefined);
            }));
            it('avoids oblique React errors by forcing cheap-module-source-map', () => __awaiter(_this, void 0, void 0, function* () {
                // See https://reactjs.org/docs/cross-origin-errors.html#webpack
                const { devtool } = yield config_1.default(utilities_1.createWorkspace({
                    env: development,
                    dependencies: utilities_1.createDependency('react')
                }), { sourceMaps: 'fast' });
                expect(devtool).toEqual('cheap-module-source-map');
            }));
        });
    });
});