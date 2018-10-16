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
const plugins = require("../../../../../plugins");
const config_1 = require("../../../config");
describe('webpackConfig()', () => {
    describe('rules', () => {
        describe('graphql', () => {
            function findGraphQLRule({ module: { rules } }) {
                return rules.find(rule => rule.test != null && rule.test instanceof RegExp && rule.test.source === /\.graphql$/.source && rule.use && Array.isArray(rule.use));
            }
            function findGraphQLLoader(config) {
                const rule = findGraphQLRule(config);
                if (!rule) {
                    return undefined;
                }
                return rule.use.find(loader => loader.loader === 'graphql-tag/loader');
            }
            it('does not include the rule by default', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace());
                const rule = findGraphQLRule(config);
                expect(rule).toBeUndefined();
            }));
            it('includes it for a project with GraphQL', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    plugins: [plugins.graphql({ schema: './mock-schema.json' })]
                });
                const config = yield config_1.default(workspace);
                const loader = findGraphQLLoader(config);
                expect(loader).not.toBeUndefined();
            }));
            it('caches GraphQL transforms', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    plugins: [plugins.graphql({ schema: './mock-schema.json' })]
                });
                const config = yield config_1.default(workspace);
                const rule = findGraphQLRule(config);
                expect(rule).toHaveProperty('use.0.loader', 'cache-loader');
                expect(rule).toHaveProperty('use.0.options.cacheDirectory');
                expect(rule.use[0].options.cacheDirectory).toMatch(workspace.paths.cache);
            }));
        });
    });
});