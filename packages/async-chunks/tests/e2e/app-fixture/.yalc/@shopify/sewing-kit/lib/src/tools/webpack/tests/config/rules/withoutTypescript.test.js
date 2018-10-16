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
        describe('withoutTypescript', () => {
            function findWithoutTypescriptRule({ module: { rules } }) {
                return rules.find(({ use }) => Array.isArray(use) && typeof use[0] === 'object' && use[0].loader === require.resolve("../../../../../../../lib/packages/webpack-no-typescript-ts-loader"));
            }
            it('is included by default', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findWithoutTypescriptRule(config);
                expect(workspace.project.usesTypeScript).toBe(false);
                expect(rule).toBeDefined();
            }));
            it('is omitted when the project uses Typescript', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ dependencies: { typescript: '1.1' } });
                const config = yield config_1.default(workspace);
                const rule = findWithoutTypescriptRule(config);
                expect(workspace.project.usesTypeScript).toBe(true);
                expect(rule).toBeUndefined();
            }));
            it('never fails on .js files', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findWithoutTypescriptRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.js'))).toBe(false);
            }));
            it('never fails on .jsx files', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ dependencies: { react: '1.1' } });
                const config = yield config_1.default(workspace);
                const rule = findWithoutTypescriptRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.jsx'))).toBe(false);
            }));
            it('throws error for ts files in non-typescript workspace', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findWithoutTypescriptRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.ts'))).toBe(true);
            }));
            it('throws error for tsx files in non-typescript workspace', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ dependencies: { react: '1.1' } });
                const config = yield config_1.default(workspace);
                const rule = findWithoutTypescriptRule(config);
                expect(rule.test.test(path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.tsx'))).toBe(true);
            }));
        });
    });
});