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
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const e2eBase = path_1.resolve(__dirname, '..');
const baseFixture = path_1.resolve(e2eBase, 'fixtures', 'polaris');
const fixture = path_1.resolve(e2eBase, 'tmp', `polaris-production-client-${Date.now()}`);
const build = path_1.resolve(fixture, 'build');
const client = path_1.resolve(build, 'client');
const assets = path_1.resolve(client, 'assets.json');
describe('polaris', () => {
    beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.mkdirp(fixture);
        yield fs_extra_1.copy(baseFixture, fixture);
        utilities_1.yarnInstall(fixture);
    }), 60000);
    afterEach(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.remove(client);
        yield fs_extra_1.copy(baseFixture, fixture);
    }));
    afterAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.remove(fixture);
    }));
    describe('client', () => {
        describe('production', () => {
            it('minifies CSS', () => {
                utilities_1.runClientBuild(fixture);
                const { css } = fs_extra_1.readJsonSync(assets).assets.main;
                const content = fs_extra_1.readFileSync(path_1.resolve(client, path_1.basename(css)), 'utf8');
                // Trim can be removed after: https://github.com/Shopify/sewing-kit/issues/628
                expect(content.trim()).not.toMatch('\n');
            });
            it('uses minified Polaris CSS classes in vendor CSS', () => {
                utilities_1.runClientBuild(fixture);
                const { css } = fs_extra_1.readJsonSync(assets).assets['vendors~main'];
                const content = fs_extra_1.readFileSync(path_1.resolve(client, path_1.basename(css)), 'utf8');
                expect(content).not.toMatch(/\.Polaris-/);
                expect(content).toMatch(/\.p_[0-9a-zA-Z]{5}{/);
            });
            it('references minified Polaris CSS classes in vendor JS', () => {
                utilities_1.runClientBuild(fixture);
                const { js } = fs_extra_1.readJsonSync(assets).assets['vendors~main'];
                const content = fs_extra_1.readFileSync(path_1.resolve(client, path_1.basename(js)), 'utf8');
                // eslint-disable-next-line no-useless-escape
                expect(content).toMatch(/\{Button:"p_[0-9a-zA-Z]{5}\"/);
            });
            it('references hashed app CSS classes in main', () => {
                utilities_1.runClientBuild(fixture);
                const { css } = fs_extra_1.readJsonSync(assets).assets.main;
                const content = fs_extra_1.readFileSync(path_1.resolve(client, path_1.basename(css)), 'utf8');
                expect(content).not.toMatch('ShouldBeMinified');
                expect(content).toMatch(/\.[a-zA-Z0-9_-]+\s*?\{color:purple\s*;?\}/);
            });
            // eslint-disable-next-line jest/no-disabled-tests
            it.skip('produces different CSS files when SCSS variables change', () => {});
        });
    });
});