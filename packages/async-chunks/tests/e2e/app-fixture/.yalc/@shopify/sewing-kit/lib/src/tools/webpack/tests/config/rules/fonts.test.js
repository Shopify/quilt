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
const config_1 = require("../../../config");
describe('webpackConfig()', () => {
    describe('rules', () => {
        describe('fonts', () => {
            function findFontRule({ module: { rules } }) {
                return rules.find(rule => rule.test != null && rule.test instanceof RegExp && rule.test.source === /\.woff2$/.source && rule.loader === 'url-loader');
            }
            it('includes the rule', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace());
                const rule = findFontRule(config);
                expect(rule).not.toBeUndefined();
            }));
        });
    });
});