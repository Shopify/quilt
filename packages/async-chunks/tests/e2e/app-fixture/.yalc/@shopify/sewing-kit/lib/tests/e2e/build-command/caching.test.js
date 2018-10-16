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
const glob_1 = require("glob");
const utilities_1 = require("tests/e2e/utilities");
const utilities_2 = require("./utilities");
const baseFixture = path_1.resolve(__dirname, 'fixtures', 'caching');
const fixture = path_1.resolve(__dirname, 'tmp', `caching-${Date.now()}`);
const build = path_1.resolve(fixture, 'build');
const client = path_1.resolve(build, 'client');
const server = path_1.resolve(build, 'server');
const assets = path_1.resolve(client, 'assets.json');
const main = path_1.resolve(fixture, 'client', 'index.js');
const asyncFile = path_1.resolve(fixture, 'client', 'async.js');
const newEntry = path_1.resolve(fixture, 'client', 'new-entry.js');
const originalMainContent = fs_extra_1.readFileSync(path_1.resolve(baseFixture, 'client', 'index.js'));
const newEntryContent = fs_extra_1.readFileSync(path_1.resolve(baseFixture, 'client', 'new-entry.js'));
describe('caching', () => {
    beforeEach(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.mkdirp(fixture);
        yield fs_extra_1.copy(baseFixture, fixture);
    }));
    afterEach(() => {
        fs_extra_1.removeSync(fixture);
    });
    it('generates valid sha hashes', () => __awaiter(_this, void 0, void 0, function* () {
        utilities_2.runClientBuild(fixture);
        const jsFiles = glob_1.sync(`${client}/*.js`).sort();
        jsFiles.forEach(file => {
            // eslint-disable-next-line typescript/no-non-null-assertion
            const chunkId = file.match(/-([0-9a-f]{64})\.js$/)[1];
            expect(utilities_1.hashFile(file)).toEqual(chunkId);
        });
        const cssFiles = glob_1.sync(`${client}/*.css`).sort();
        cssFiles.forEach(file => {
            // eslint-disable-next-line typescript/no-non-null-assertion
            const chunkId = file.match(/-([0-9a-f]{64})\.css$/)[1];
            expect(utilities_1.hashFile(file)).toEqual(chunkId);
        });
    }));
    it('generates a vendor chunk in client', () => {
        utilities_2.runBuild(fixture);
        expect(glob_1.sync(`${client}/vendor*.js`)).toHaveLength(1);
        expect(glob_1.sync(`${server}/vendor*.js`)).toHaveLength(0);
    });
    it('does not store client dependency metadata in the vendor bundle', () => {
        utilities_2.runBuild(fixture);
        expect(glob_1.sync(`${client}/runtime-*.js`)).toHaveLength(1);
        expect(fs_extra_1.existsSync(path_1.resolve(server, 'runtime.js'))).toBe(false);
    });
    it('does not update runtime and vendors hash when app code changes', () => {
        utilities_2.runClientBuild(fixture);
        const originalAssets = fs_extra_1.readJSONSync(assets).assets;
        fs_extra_1.appendFileSync(main, `console.log('changed');`);
        utilities_2.runClientBuild(fixture);
        const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
        expect(originalAssets['vendors~main'].js).toBe(updatedAssets['vendors~main'].js);
        expect(originalAssets.runtime.js).toBe(updatedAssets.runtime.js);
        expect(originalAssets.main.js).not.toBe(updatedAssets.main.js);
    });
    it('does not update the vendor hash when new modules are added', () => {
        utilities_2.runClientBuild(fixture);
        const originalAssets = fs_extra_1.readJSONSync(assets).assets;
        fs_extra_1.writeFileSync(main, `
      import newModule from './new-module';
      console.log(newModule);
      ${originalMainContent}
    `);
        utilities_2.runClientBuild(fixture);
        const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
        expect(originalAssets['vendors~main'].js).toBe(updatedAssets['vendors~main'].js);
    });
    it('does not update the vendor hash for new entrypoints', () => {
        utilities_2.runClientBuild(fixture);
        const originalAssets = fs_extra_1.readJSONSync(assets).assets;
        utilities_2.runClientBuild(fixture, { '--config': './new-entry.config.js' });
        const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
        expect(originalAssets['vendors~main'].js).toBe(updatedAssets['vendors~main'].js);
        expect(originalAssets.runtime.js).toBe(updatedAssets.runtime.js);
    });
    it('does not update the vendor hash when new entrypoints with shared modules are added', () => {
        utilities_2.runClientBuild(fixture, { '--config': './new-entry.config.js' });
        const originalAssets = fs_extra_1.readJSONSync(assets).assets;
        utilities_2.runClientBuild(fixture);
        fs_extra_1.writeFileSync(newEntry, `
      import sharedModule from './shared-module';
      ${newEntryContent}
      console.log(sharedModule);
      `);
        const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
        expect(originalAssets['vendors~main'].js).toBe(updatedAssets['vendors~main'].js);
        expect(originalAssets.runtime.js).toBe(updatedAssets.runtime.js);
    });
    describe('async imports', () => {
        it('embeds async hashes in the runtime bundle', () => __awaiter(_this, void 0, void 0, function* () {
            utilities_2.runClientBuild(fixture);
            const chunkFilename = glob_1.sync(`${client}/foo-*.js`)[0];
            const runtimePath = glob_1.sync(`${client}/runtime*.js`)[0];
            // eslint-disable-next-line typescript/no-non-null-assertion
            const asyncHash = chunkFilename.match(/-([0-9a-f]{64})\.js$/)[1];
            const runtimeContents = yield fs_extra_1.readFile(runtimePath, 'utf8');
            expect(runtimeContents).toMatch(asyncHash);
        }));
        it('creates an async chunk with the default name', () => {
            fs_extra_1.writeFileSync(main, `
        import('./new-async').then((asyncModule) => console.log(asyncModule));
        ${originalMainContent}
        `);
            utilities_2.runClientBuild(fixture);
            expect(glob_1.sync(`${client}/new-async-*.js`)).toHaveLength(1);
            expect(glob_1.sync(`${client}/new-async-*.css`)).toHaveLength(1);
        });
        it('creates an async chunk with a specified name', () => {
            fs_extra_1.writeFileSync(main, `
        import(/* webpackChunkName: 'bar' */'./new-async').then((asyncBarModule) => console.log(asyncBarModule));
        ${originalMainContent}
      `);
            utilities_2.runClientBuild(fixture);
            expect(glob_1.sync(`${client}/bar-*.js`)).toHaveLength(1);
            expect(glob_1.sync(`${client}/bar-*.css`)).toHaveLength(1);
        });
        it('updates runtime and chunk hashes when async code changes', () => {
            utilities_2.runClientBuild(fixture);
            const originalAssets = fs_extra_1.readJSONSync(assets).assets;
            fs_extra_1.writeFileSync(asyncFile, `console.log('lol'); ${fs_extra_1.readFileSync(asyncFile)}`);
            utilities_2.runClientBuild(fixture);
            const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
            expect(originalAssets.runtime.js).not.toBe(updatedAssets.runtime.js);
            expect(originalAssets.foo.js).not.toBe(updatedAssets.foo.js);
            expect(originalAssets.main.js).toBe(updatedAssets.main.js);
            expect(originalAssets.foo.css).toBe(updatedAssets.foo.css);
        });
        it('does not update the vendor hash when an async module with a default name is added', () => {
            utilities_2.runClientBuild(fixture);
            const originalAssets = fs_extra_1.readJSONSync(assets).assets;
            fs_extra_1.writeFileSync(main, `
        import('./new-async').then((asyncModule) => console.log(asyncModule));
        ${originalMainContent}
      `);
            utilities_2.runClientBuild(fixture);
            const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
            expect(originalAssets['vendors~main'].js).toBe(updatedAssets['vendors~main'].js);
            expect(originalAssets.runtime.js).not.toBe(updatedAssets.runtime.js);
        });
        it('does not update the vendor hash when an async module with a specified name is added', () => {
            utilities_2.runClientBuild(fixture);
            const originalAssets = fs_extra_1.readJSONSync(assets).assets;
            fs_extra_1.writeFileSync(main, `
        import(/* webpackChunkName: 'bar' */'./new-async').then((asyncBarModule) => console.log(asyncBarModule));
        ${originalMainContent}
      `);
            utilities_2.runClientBuild(fixture);
            const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
            expect(originalAssets['vendors~main'].js).toBe(updatedAssets['vendors~main'].js);
            expect(originalAssets.runtime.js).not.toBe(updatedAssets.runtime.js);
        });
    });
    describe('externals', () => {
        it('does not update the vendor hash when externals are added', () => {
            utilities_2.runClientBuild(fixture);
            const originalAssets = fs_extra_1.readJSONSync(assets).assets;
            utilities_2.runClientBuild(fixture, { '--config': './externals.config.js' });
            const updatedAssets = fs_extra_1.readJSONSync(assets).assets;
            expect(originalAssets.runtime.js).toBe(updatedAssets.runtime.js);
            expect(originalAssets['vendors~main'].js).toBe(updatedAssets['vendors~main'].js);
        });
    });
});