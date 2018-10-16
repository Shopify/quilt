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
const fs_extra_1 = require("fs-extra");
const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
describe('fail-on-unexpected-module-shaking-plugin', () => {
    describe('with omitted package.json#sideEffects', () => {
        it('ignores JavaScript side-effect imports', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'no-side-effects-config');
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(0);
            const jsResult = (yield fs_extra_1.readFile(path.join(fixture, 'build', 'main.js'), 'utf-8')).toString();
            expect(jsResult).toContain('bar output');
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
        it('ignores CSS side-effect imports', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'no-side-effects-config');
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(0);
            const cssPath = glob.sync(`${fixture}/build/main-*.css`)[0];
            const cssResult = (yield fs_extra_1.readFile(cssPath, 'utf-8')).toString();
            expect(cssResult).toContain('foo-content');
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
    });
    describe('with empty package.json#sideEffects', () => {
        it('fails on JavaScript side-effect imports', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'unexpected-js-shaking');
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(1);
            expect(errors[0]).toMatch(/webpack has removed these modules:\s+".\/unused-module\/index.js"/);
            expect(errors[0]).not.toMatch('used-module.js');
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
        it('fails on CSS side-effect imports', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'unexpected-css-shaking');
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(1);
            expect(errors[0]).toMatch(/webpack has removed these modules:\s+".\/foo.css"/);
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
        it('ignores excluded module removals', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'excluded-module-shaking');
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(0);
            const jsResult = (yield fs_extra_1.readFile(path.join(fixture, 'build', 'main.js'), 'utf-8')).toString();
            expect(jsResult).not.toContain('expected-to-be-shaken');
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
        it('ignores dropped pure modules', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'unused-pure-modules');
            yield fs_extra_1.remove(path.join(fixture, 'build'));
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(0);
            const jsResult = (yield fs_extra_1.readFile(path.join(fixture, 'build', 'main.js'), 'utf-8')).toString();
            expect(jsResult).not.toContain('foo-value');
            expect(jsResult).not.toContain('default-reexport-value');
            expect(jsResult).not.toContain('named-reexport-value');
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
    });
    describe('dependencies', () => {
        it('ignores unused side-effect imports in dependency with no package.json#sideEffects', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'dependency-with-no-side-effects-config');
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(0);
            const jsResult = (yield fs_extra_1.readFile(path.join(fixture, 'build', 'main.js'), 'utf-8')).toString();
            expect(jsResult).toContain('fake-package-output');
            expect(jsResult).toContain('fake-package-foo-output');
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
        it('fails on unused side-effect imports in dependency with package.json#sideEffects', () => __awaiter(_this, void 0, void 0, function* () {
            const fixture = path.resolve(__dirname, 'fixtures', 'dependency-with-side-effects-config');
            const stats = yield runWebpack(fixture);
            const { errors } = stats.toJson({ errors: true });
            expect(errors).toHaveLength(1);
            expect(errors[0]).toMatch(/".\/node_modules\/fake-package\/foo.js"/);
            expect(errors[0]).toMatch(/".\/node_modules\/fake-package\/index.js"/);
            yield fs_extra_1.remove(path.join(fixture, 'build'));
        }));
    });
    it('ignores modules listed in package.json#sideEffects', () => __awaiter(_this, void 0, void 0, function* () {
        const fixture = path.resolve(__dirname, 'fixtures', 'package-json-side-effect-module');
        yield fs_extra_1.remove(path.join(fixture, 'build'));
        const stats = yield runWebpack(fixture);
        const { errors } = stats.toJson({ errors: true });
        expect(errors).toHaveLength(0);
        const jsResult = (yield fs_extra_1.readFile(path.join(fixture, 'build', 'main.js'), 'utf-8')).toString();
        expect(jsResult).toContain('listed-in-package-json-side-effects-value');
        yield fs_extra_1.remove(path.join(fixture, 'build'));
    }));
});
function runWebpack(fixturePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const originalCwd = process.cwd();
        return new Promise((resolve, reject) => {
            process.chdir(fixturePath);
            const config = require(`${fixturePath}/webpack.config.js`);
            webpack(config).run((error, stats) => {
                process.chdir(originalCwd);
                if (error) {
                    reject(error);
                }
                resolve(stats);
            });
        });
    });
}