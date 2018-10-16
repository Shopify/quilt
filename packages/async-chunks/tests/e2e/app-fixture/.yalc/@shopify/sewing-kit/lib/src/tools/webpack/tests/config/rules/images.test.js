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
        describe('images', () => {
            const fakeIconPath = path.resolve('icons/my-icon.svg');
            const fakeImagePath = path.resolve('icons/my-image.png');
            const fakeFaviconPath = path.resolve('favicon.ico');
            const fakeIllustrationPath = path.resolve('illustrations/my-illustration.svg');
            function findSVGIconsRule({ module: { rules } }) {
                return rules.find(rule => {
                    return Array.isArray(rule.use) && rule.use.map(loader => loader.loader).includes('@shopify/images/icon-loader');
                });
            }
            function findICORule({ module: { rules } }) {
                return rules.find(rule => rule.test != null && rule.test instanceof RegExp && rule.test.source === /\.ico$/.source && rule.use.loader === 'file-loader');
            }
            function findImageLoader({ module: { rules } }) {
                return rules.find(rule => {
                    return Array.isArray(rule.use) && rule.use[0].loader === 'url-loader';
                });
            }
            function optimizesSVG(rule) {
                return rule.loader === 'image-webpack-loader' && typeof rule.options === 'object' && rule.options.svgo != null;
            }
            describe.each([[new env_1.default({ mode: 'development', target: 'client' })], [new env_1.default({ mode: 'development', target: 'server' })], [new env_1.default({ mode: 'test', target: 'client' })], [new env_1.default({ mode: 'test', target: 'server' })]])('%s', ({ mode, target }) => {
                it('does not optimize images', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({ env: new env_1.default({ mode, target }) }));
                    const rule = findImageLoader(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule.use).toHaveLength(1);
                }));
            });
            describe.each([[new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'staging', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'server' })]])('%s', env => {
                it('adds an image loader that does not match icons', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({ env }));
                    const rule = findImageLoader(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule.test(fakeIconPath)).toBe(false);
                    expect(rule.test(fakeFaviconPath)).toBe(false);
                    expect(rule.test(fakeImagePath)).toBe(true);
                    expect(rule.test(fakeIllustrationPath)).toBe(true);
                }));
                it('adds an ico loader that matches ico files', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({ env }));
                    const rule = findICORule(config);
                    expect(rule).not.toBeUndefined();
                }));
                it('optimizes SVGs in the image loader', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({ env }));
                    const rule = findImageLoader(config);
                    expect(optimizesSVG(rule.use[1])).toBe(true);
                }));
                it('adds a rule that runs optimization and icon loading', () => __awaiter(_this, void 0, void 0, function* () {
                    const config = yield config_1.default(utilities_1.createWorkspace({ env }));
                    const rule = findSVGIconsRule(config);
                    expect(rule).not.toBeUndefined();
                    expect(rule.test(fakeIconPath)).toBe(true);
                    expect(rule.test(fakeImagePath)).toBe(false);
                    expect(rule.test(fakeIllustrationPath)).toBe(false);
                    expect(optimizesSVG(rule.use[2])).toBe(true);
                }));
                if (env.target === 'client') {
                    it('emits image files for client builds', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({ env }));
                        const rule = findImageLoader(config);
                        expect(rule.use[0].options.emitFile).toBe(true);
                    }));
                }
                if (env.target === 'server') {
                    it('does not emit image files for server builds', () => __awaiter(_this, void 0, void 0, function* () {
                        const config = yield config_1.default(utilities_1.createWorkspace({ env }));
                        const rule = findImageLoader(config);
                        expect(rule.use[0].options.emitFile).toBe(false);
                    }));
                }
            });
        });
    });
});