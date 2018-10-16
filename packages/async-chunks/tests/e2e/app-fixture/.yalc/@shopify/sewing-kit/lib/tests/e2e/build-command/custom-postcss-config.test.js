"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("./utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'custom-postcss-config');
const build = path_1.resolve(fixture, 'tmp');
const client = path_1.resolve(fixture, 'public/bundles');
describe('custom-postcss-config', () => {
    afterEach(() => fs_extra_1.removeSync(client));
    afterAll(() => fs_extra_1.removeSync(build));
    it('uses custom short properties rule', () => {
        utilities_1.runBuild(fixture);
        const { assets } = fs_extra_1.readJSONSync(path_1.join(client, 'sewing-kit-manifest.json'));
        const css = fs_extra_1.readFileSync(path_1.join(client, path_1.basename(assets.main.css)), 'utf-8');
        expect(css).toMatch('{zoom:9001}');
    });
    it('does not pick up postcss-shopify`s autoprefixer', () => {
        utilities_1.runBuild(fixture);
        const { assets } = fs_extra_1.readJSONSync(path_1.join(client, 'sewing-kit-manifest.json'));
        const css = fs_extra_1.readFileSync(path_1.join(client, path_1.basename(assets.main.css)), 'utf-8');
        expect(css).toMatch('{appearance:none}');
    });
});