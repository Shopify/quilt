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
const fixture = path_1.resolve(__dirname, 'fixtures', 'basic-app');
const build = path_1.resolve(fixture, 'build');
const assetsJSON = path_1.resolve(build, 'assets.json');
describe('manifest', () => {
    afterEach(() => fs_extra_1.remove(build));
    let assets;
    beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.runWebpack(fixture);
        const content = yield fs_extra_1.readJson(assetsJSON);
        assets = content.assets;
    }));
    it('has a key for all chunks', () => {
        expect(Object.keys(assets).sort()).toEqual(['entry-1', 'entry-2', 'vendor']);
    });
    it('has a js path for all bundles', () => {
        expect(assets).toHaveProperty('entry-1.js');
        expect(assets).toHaveProperty('entry-2.js');
        expect(assets).toHaveProperty('vendor.js');
    });
    it('has a css path for bundles containing css', () => {
        expect(assets).toHaveProperty('entry-1.css');
        expect(assets).not.toHaveProperty('entry-2.css');
        expect(assets).toHaveProperty('vendor.css');
    });
});