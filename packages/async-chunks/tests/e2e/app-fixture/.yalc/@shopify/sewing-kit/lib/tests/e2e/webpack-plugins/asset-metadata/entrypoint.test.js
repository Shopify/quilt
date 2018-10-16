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
const path_1 = require("path");
const utilities_1 = require("./utilities");
describe('entrypoints', () => {
    describe('dependencies', () => {
        const fixture = path_1.resolve(__dirname, 'fixtures', 'basic-app');
        const build = path_1.resolve(fixture, 'build');
        const assetsJSON = path_1.resolve(build, 'assets.json');
        let entrypoints;
        beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.runWebpack(fixture);
            const content = yield fs_extra_1.readJson(assetsJSON);
            entrypoints = content.entrypoints;
        }));
        afterAll(() => fs_extra_1.remove(build));
        it('has keys for entry bundles', () => {
            expect(Object.keys(entrypoints).sort()).toEqual(['entry-1', 'entry-2']);
        });
        it('makes all entrypoints depend on vendor js', () => {
            expect(utilities_1.removeHashes(entrypoints['entry-1'].js)).toEqual(['vendor.js', 'entry-1.js']);
            expect(utilities_1.removeHashes(entrypoints['entry-2'].js)).toEqual(['vendor.js', 'entry-2.js']);
        });
        it('makes both entrypoints depend on vendor css', () => {
            expect(utilities_1.removeHashes(entrypoints['entry-1'].css)).toEqual(['vendor.css', 'entry-1.css']);
            expect(utilities_1.removeHashes(entrypoints['entry-2'].css)).toEqual(['vendor.css']);
        });
    });
    describe('asset integrity', () => {
        const fixture = path_1.resolve(__dirname, 'fixtures', 'integrity-hash-config');
        const build = path_1.resolve(fixture, 'build');
        const assetsJSON = path_1.resolve(build, 'assets.json');
        let entrypoints;
        beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
            yield fs_extra_1.remove(build);
            yield utilities_1.runWebpack(fixture);
            const content = yield fs_extra_1.readJson(assetsJSON);
            entrypoints = content.entrypoints;
        }), 15000);
        afterAll(() => __awaiter(_this, void 0, void 0, function* () {
            return fs_extra_1.remove(build);
        }));
        it('includes base64 integrity hashes for JavaScript assets', () => __awaiter(_this, void 0, void 0, function* () {
            const { path, integrity } = entrypoints.main.js[0];
            const localPath = path_1.resolve(build, path);
            expect(integrity).toEqual(`sha256-${utilities_1.opensslHash(localPath)}`);
        }));
        it('includes base64 integrity hashes for CSS assets', () => __awaiter(_this, void 0, void 0, function* () {
            const { path, integrity } = entrypoints.main.css[0];
            const localPath = path_1.resolve(build, path);
            expect(integrity).toEqual(`sha256-${utilities_1.opensslHash(localPath)}`);
        }));
    });
});