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
const paths_1 = require("../paths");
const __1 = require("../..");
const project_1 = require("../project");
const config_1 = require("../config");
const plugins_1 = require("../../plugins");
const development = new __1.Env({ mode: 'development' });
const production = new __1.Env({ mode: 'production' });
describe('loadPath()', () => {
    let project;
    beforeEach(() => {
        project = new project_1.Project(false, { dependencies: {}, devDependencies: {} }, 'fake_node_modules_hash', false, false, false);
    });
    it('uses a path override', () => __awaiter(_this, void 0, void 0, function* () {
        const appPath = path_1.resolve('foo/bar');
        const config = new config_1.Config('test', [plugins_1.paths({
            app: appPath
        })]);
        expect(paths_1.default(process.cwd(), development, config, project)).toHaveProperty('app', appPath);
    }));
    it('extends a path override where that path is used for inferring others', () => __awaiter(_this, void 0, void 0, function* () {
        const appPath = path_1.resolve('foo/bar');
        const config = new config_1.Config('test', [plugins_1.paths({
            app: appPath
        })]);
        expect(paths_1.default(process.cwd(), production, config, project)).toHaveProperty('styles', path_1.resolve(appPath, 'styles'));
    }));
    describe('node', () => {
        it('stores build files in a temporary directory', () => __awaiter(_this, void 0, void 0, function* () {
            const config = new config_1.Config('test');
            expect(paths_1.default(process.cwd(), production, config, project)).toHaveProperty('build', path_1.resolve(process.cwd(), 'build'));
        }));
        it('stores cached files in a temporary directory', () => __awaiter(_this, void 0, void 0, function* () {
            const config = new config_1.Config('test');
            expect(paths_1.default(process.cwd(), production, config, project)).toHaveProperty('cache', path_1.resolve(process.cwd(), 'build', 'cache'));
        }));
    });
    describe('rails', () => {
        beforeEach(() => {
            project = new project_1.Project(true, { dependencies: {}, devDependencies: {} }, 'fake_node_modules_hash', false, false, false);
        });
        it('stores development builds in tmp', () => __awaiter(_this, void 0, void 0, function* () {
            const developmentConfig = new config_1.Config('development-mode');
            expect(paths_1.default(process.cwd(), development, developmentConfig, project)).toHaveProperty('build', path_1.resolve(process.cwd(), 'tmp', 'sewing-kit'));
        }));
        it('makes test assets available to integration tests', () => {
            const testConfig = new config_1.Config('test-mode');
            expect(paths_1.default(process.cwd(), new __1.Env({ mode: 'test' }), testConfig, project)).toHaveProperty('build', path_1.resolve(process.cwd(), 'public', 'bundles'));
        });
        describe.each([['production', 'staging']])('%s', mode => {
            it('generates builds in shopify-cloud’s default sewing-kit directory', () => __awaiter(_this, void 0, void 0, function* () {
                const config = new config_1.Config('test');
                expect(paths_1.default(process.cwd(), new __1.Env({ mode }), config, project)).toHaveProperty('build', path_1.resolve(process.cwd(), 'public', 'bundles'));
            }));
            it('accepts build directory override', () => __awaiter(_this, void 0, void 0, function* () {
                const config = new config_1.Config('test', [plugins_1.paths({
                    build: path_1.resolve('foo')
                })]);
                expect(paths_1.default(process.cwd(), new __1.Env({ mode }), config, project)).toHaveProperty('build', path_1.resolve('foo'));
            }));
            it('speeds up buildkite by storing cacheable files in a location that is reused by intermediate container builds', () => __awaiter(_this, void 0, void 0, function* () {
                const config = new config_1.Config('test');
                expect(paths_1.default(process.cwd(), new __1.Env({ mode }), config, project)).toHaveProperty('cache', path_1.resolve(process.cwd(), 'tmp', 'cache', 'sewing-kit'));
            }));
        });
    });
});