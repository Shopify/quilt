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
const config_1 = require("../../../config");
describe('webpackConfig()', () => {
    describe('rules', () => {
        describe('withoutReact', () => {
            function findWithoutReactRule({ module: { rules } }) {
                return rules.find(({ use }) => Array.isArray(use) && typeof use[0] === 'object' && use[0].loader === require.resolve("../../../../../../../lib/packages/webpack-no-react-jsx-loader"));
            }
            it('is included by default', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findWithoutReactRule(config);
                expect(workspace.project.usesReact).toBe(false);
                expect(rule).toBeDefined();
            }));
            it('is omitted when the project uses React', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ dependencies: { react: '1.1' } });
                const config = yield config_1.default(workspace);
                const rule = findWithoutReactRule(config);
                expect(workspace.project.usesReact).toBe(true);
                expect(rule).toBeUndefined();
            }));
            it('is omitted when the project uses Preact', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ dependencies: { preact: '1.1' } });
                const config = yield config_1.default(workspace);
                const rule = findWithoutReactRule(config);
                expect(workspace.project.usesPreact).toBe(true);
                expect(rule).toBeUndefined();
            }));
            it('never fails on .js files', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findWithoutReactRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.js'))).toBe(false);
            }));
            it('never fails on .ts files', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    dependencies: { typescript: 'latest' }
                });
                const config = yield config_1.default(workspace);
                const rule = findWithoutReactRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.ts'))).toBe(false);
            }));
            it('throws error for jsx files in non-react workspace', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findWithoutReactRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.jsx'))).toBe(true);
            }));
            it('throws error for tsx files in non-react workspace', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ dependencies: { typescript: '1.1' } });
                const config = yield config_1.default(workspace);
                const rule = findWithoutReactRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.tsx'))).toBe(true);
            }));
        });
    });
});