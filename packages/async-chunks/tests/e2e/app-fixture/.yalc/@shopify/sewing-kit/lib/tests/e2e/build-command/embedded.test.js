"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("./utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'embedded');
const build = path_1.resolve(fixture, 'tmp');
const client = path_1.resolve(fixture, 'public', 'bundles');
const assets = path_1.resolve(client, 'sewing-kit-manifest.json');
describe('embedded', () => {
    beforeAll(() => utilities_1.yarnInstall(fixture));
    afterAll(() => {
        fs_extra_1.removeSync(path_1.resolve(fixture, 'node_modules'));
    });
    describe('production', () => {
        beforeAll(() => {
            utilities_1.runBuild(fixture);
        });
        afterAll(() => {
            fs_extra_1.removeSync(build);
            fs_extra_1.removeSync(client);
        });
        it('includes embedded app features', () => {
            const { js } = fs_extra_1.readJsonSync(assets).assets['vendors~main'];
            const content = fs_extra_1.readFileSync(path_1.resolve(client, path_1.basename(js)), 'utf8');
            expect(content).toMatch(/\.Alert=/);
            expect(content).toMatch(/\.Modal=/);
            expect(content).toMatch(/\.ResourcePicker=/);
        });
        it('uses minified Polaris CSS classes in CSS', () => {
            const { css } = fs_extra_1.readJsonSync(assets).assets['vendors~main'];
            const content = fs_extra_1.readFileSync(path_1.resolve(client, path_1.basename(css)), 'utf8');
            expect(content).not.toMatch(/\.Polaris-/);
            expect(content).toMatch(/\.p_[0-9a-zA-Z]{5}{/);
        });
        it('references minified Polaris CSS classes in JS', () => {
            const { js } = fs_extra_1.readJsonSync(assets).assets['vendors~main'];
            const content = fs_extra_1.readFileSync(path_1.resolve(client, path_1.basename(js)), 'utf8');
            // eslint-disable-next-line no-div-regex
            expect(content).toMatch(/=\{Button:"p_[a-z0-9A-Z]{5}"/);
        });
    });
});