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
const fixture = path_1.resolve(__dirname, 'fixtures', 'public-path-with-url');
const build = path_1.resolve(fixture, 'build');
const assetsJSON = path_1.resolve(build, 'assets.json');
describe('public-path-with-url', () => {
    afterEach(() => fs_extra_1.remove(build));
    let assets;
    let entrypoints;
    beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.runWebpack(fixture);
        const content = yield fs_extra_1.readJson(assetsJSON);
        assets = content.assets;
        entrypoints = content.entrypoints;
    }));
    describe('asset map', () => {
        it('outputs assets relative to assetBasePath', () => {
            expect(assets.main.js).toMatch('build/main.js');
            expect(assets.main.css).toMatch('build/main.css');
        });
    });
    describe('entrypoints', () => {
        it('prepends public path to assets', () => {
            expect(entrypoints.main.js).toEqual([{
                path: 'https://prepended.io:8080/url/path/main.js'
            }]);
            expect(entrypoints.main.css).toEqual([{
                path: 'https://prepended.io:8080/url/path/main.css'
            }]);
        });
    });
});