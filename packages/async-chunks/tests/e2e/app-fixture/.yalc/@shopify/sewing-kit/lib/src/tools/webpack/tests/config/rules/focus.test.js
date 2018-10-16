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
        describe('focus', () => {
            function findFocusRule({ module: { rules } }) {
                return rules.find(({ use }) => Array.isArray(use) && typeof use[0] === 'object' && use[0].loader === require.resolve("../../../../../../../lib/packages/webpack-section-focus-loader"));
            }
            function testRule(rule, file) {
                if (typeof rule.test !== 'function') {
                    throw new Error();
                }
                return rule.test(file);
            }
            it('is omitted by default', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace);
                const rule = findFocusRule(config);
                expect(rule).toBeUndefined();
            }));
            it('is included when focusing a section', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace, { focus: ['Products'] });
                const rule = findFocusRule(config);
                expect(rule).not.toBeUndefined();
            }));
            it('sets the focused sections in the section-focus-loader options', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace, { focus: ['Products'] });
                const rule = findFocusRule(config);
                expect(rule).toHaveProperty('use.0.options.focus', ['Products']);
            }));
            it('does not match an index file on any section', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace, {
                    focus: ['Products']
                });
                const rule = findFocusRule(config);
                expect(testRule(rule, path.join(workspace.paths.sections, 'Orders/index.tsx'))).toBe(false);
            }));
            it('matches a file in a non-focused section', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace, {
                    focus: ['Products']
                });
                const rule = findFocusRule(config);
                expect(testRule(rule, path.join(workspace.paths.sections, 'Orders/OrdersIndex/index.ts'))).toBe(true);
            }));
            it('does not match files in a focused section', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                const config = yield config_1.default(workspace, {
                    focus: ['Products', 'Orders']
                });
                const rule = findFocusRule(config);
                expect(testRule(rule, path.join(workspace.paths.sections, 'Products/ProductIndex/index.ts'))).toBe(false);
                expect(testRule(rule, path.join(workspace.paths.sections, 'Orders/OrdersShow/index.ts'))).toBe(false);
            }));
        });
    });
});