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
const manifest_1 = require("../manifest");
const hang_tight_manifest_1 = require("../hang-tight-manifest");
const env_1 = require("../../../../env");
jest.mock('../../config', () => ({
    getManifestPath: jest.fn()
}));
jest.mock('fs-extra', () => Object.assign({}, require.requireActual('fs-extra'), { readJSON: jest.fn() }));
const { readJSON } = require.requireMock('fs-extra');
const { getManifestPath } = require.requireMock('../../config');
describe('manifest', () => {
    const runner = new utilities_1.FakeRunner();
    const fakeManifestPath = 'cat-shop/manifest.json';
    beforeEach(() => {
        getManifestPath.mockReset();
        readJSON.mockReset();
    });
    it('reads the JSON at the manifest path and returns the result', () => __awaiter(_this, void 0, void 0, function* () {
        const fakeManifest = {
            assets: { css: [{ path: 'cat-shop/kitty-animations.css' }] },
            entrypoints: { js: [{ path: 'cat-shop/adorable-behaviour.js' }] }
        };
        getManifestPath.mockImplementation(() => fakeManifestPath);
        readJSON.mockImplementation(() => Promise.resolve(fakeManifest));
        const workspace = utilities_1.createWorkspace();
        const result = yield manifest_1.default(workspace, runner);
        expect(getManifestPath).toBeCalledWith(workspace);
        expect(readJSON).toBeCalledWith(fakeManifestPath);
        expect(result).toBe(fakeManifest);
    }));
    describe('when isRails and isDevelopment', () => {
        it('returns the result with path set to manifestPath', () => __awaiter(_this, void 0, void 0, function* () {
            const fakeManifest = {
                assets: { css: [{ path: 'cat-shop/kitty-animations.css' }] },
                entrypoints: { js: [{ path: 'cat-shop/adorable-behaviour.js' }] }
            };
            getManifestPath.mockImplementation(() => fakeManifestPath);
            readJSON.mockImplementation(() => Promise.resolve(fakeManifest));
            const workspace = utilities_1.createWorkspace({
                env: new env_1.default({ mode: 'development', target: 'client' }),
                isRails: true
            });
            const result = yield manifest_1.default(workspace, runner);
            expect(result).toMatchObject(Object.assign({}, fakeManifest, { path: fakeManifestPath }));
        }));
        it('it returns hangtight manifest when manifest fetch fails', () => __awaiter(_this, void 0, void 0, function* () {
            getManifestPath.mockImplementation(() => fakeManifestPath);
            readJSON.mockImplementation(input => Promise.reject(input));
            const workspace = utilities_1.createWorkspace({
                env: new env_1.default({ mode: 'development', target: 'client' }),
                isRails: true
            });
            const result = yield manifest_1.default(workspace, runner);
            expect(getManifestPath).toBeCalledWith(workspace);
            expect(readJSON).toBeCalledWith(fakeManifestPath);
            expect(result).toBe(hang_tight_manifest_1.default);
        }));
    });
    it('it throws an error when manifest fetch fails and isRails is false', () => __awaiter(_this, void 0, void 0, function* () {
        getManifestPath.mockImplementation(() => fakeManifestPath);
        readJSON.mockImplementation(input => Promise.reject(input));
        const workspace = utilities_1.createWorkspace({
            env: new env_1.default({ mode: 'development', target: 'client' }),
            isRails: false
        });
        let error = null;
        try {
            yield manifest_1.default(workspace, runner);
        } catch (err) {
            error = err;
        }
        expect(error).toBeTruthy();
    }));
    describe('when isProduction', () => {
        it('it throws an error when manifest fetch fails and isRails is false', () => __awaiter(_this, void 0, void 0, function* () {
            getManifestPath.mockImplementation(() => fakeManifestPath);
            readJSON.mockImplementation(input => Promise.reject(input));
            const workspace = utilities_1.createWorkspace({
                env: new env_1.default({ mode: 'production', target: 'client' }),
                isRails: false
            });
            let error = null;
            try {
                yield manifest_1.default(workspace, runner);
            } catch (err) {
                error = err;
            }
            expect(error).toBeTruthy();
        }));
        it('it throws an error when manifest fetch fails and isRails is true', () => __awaiter(_this, void 0, void 0, function* () {
            getManifestPath.mockImplementation(() => fakeManifestPath);
            readJSON.mockImplementation(input => Promise.reject(input));
            const workspace = utilities_1.createWorkspace({
                env: new env_1.default({ mode: 'production', target: 'client' }),
                isRails: true
            });
            let error = null;
            try {
                yield manifest_1.default(workspace, runner);
            } catch (err) {
                error = err;
            }
            expect(error).toBeTruthy();
        }));
    });
});