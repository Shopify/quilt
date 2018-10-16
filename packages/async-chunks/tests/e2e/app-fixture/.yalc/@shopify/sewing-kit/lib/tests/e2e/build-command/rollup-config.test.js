"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const child_process_1 = require("child_process");
const utilities_1 = require("../utilities");
const fixtures = {
    base: path_1.resolve(__dirname, 'fixtures', 'rollup'),
    json: path_1.resolve(__dirname, 'fixtures', 'rollup-json'),
    nodeResolve: path_1.resolve(__dirname, 'fixtures', 'rollup-node-resolve'),
    customConfig: path_1.resolve(__dirname, 'fixtures', 'rollup-custom-config')
};
function buildPath(fixture) {
    return path_1.resolve(fixture, 'dist');
}
describe('rollup plugin', () => {
    afterAll(() => {
        Object.values(fixtures).forEach(fixturePath => {
            fs_extra_1.removeSync(buildPath(fixturePath));
        });
    });
    it('generates an executable when included in sewing-kit.config', () => {
        child_process_1.execSync(`${utilities_1.sewingKitCLI} build`, { cwd: fixtures.base, stdio: 'inherit' });
        const executable = path_1.join(buildPath(fixtures.base), 'index.js');
        const result = child_process_1.execSync(`node ${executable}`, { cwd: fixtures.base }).toString().trim();
        expect(result).toBe('Rollup!');
    });
    it('converts .json files to modules', () => {
        child_process_1.execSync(`${utilities_1.sewingKitCLI} build`, { cwd: fixtures.json, stdio: 'inherit' });
        const executable = path_1.join(buildPath(fixtures.json), 'index.js');
        const result = child_process_1.execSync(`node ${executable}`, { cwd: fixtures.json }).toString().trim();
        expect(result).toBe(`{ bundler: 'rollup' }`);
    });
    it('uses node-style resolution for imports', () => {
        child_process_1.execSync(`${utilities_1.sewingKitCLI} build`, {
            cwd: fixtures.nodeResolve,
            stdio: 'inherit'
        });
        const executable = path_1.join(buildPath(fixtures.nodeResolve), 'index.js');
        const result = child_process_1.execSync(`node ${executable}`, { cwd: fixtures.nodeResolve }).toString().trim();
        expect(result).toBe(`node%20resolve`);
    });
    it('allows custom configs', () => {
        child_process_1.execSync(`${utilities_1.sewingKitCLI} build`, {
            cwd: fixtures.customConfig,
            stdio: 'inherit'
        });
        const executable = path_1.join(buildPath(fixtures.customConfig), 'index.js');
        const generatedCode = fs_extra_1.readFileSync(executable).toString();
        expect(generatedCode.startsWith('/* custom rollup config */')).toBe(true);
    });
});