"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("./utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'default-postcss-config');
const build = path_1.resolve(fixture, 'tmp');
const client = path_1.resolve(fixture, 'public/bundles');
describe('default-postcss-config', () => {
    afterEach(() => fs_extra_1.remove(client));
    afterAll(() => fs_extra_1.remove(build));
    it('autoprefixes scss', () => {
        utilities_1.runBuild(fixture);
        const { assets } = fs_extra_1.readJSONSync(path_1.join(client, 'sewing-kit-manifest.json'));
        const css = fs_extra_1.readFileSync(path_1.join(client, path_1.basename(assets.main.css)), 'utf-8');
        expect(css).toMatch('-webkit-appearance:none');
        expect(css).toMatch('-moz-appearance:none');
    });
    it('simplifies calculations', () => {
        utilities_1.runBuild(fixture);
        const { assets } = fs_extra_1.readJSONSync(path_1.join(client, 'sewing-kit-manifest.json'));
        const css = fs_extra_1.readFileSync(path_1.join(client, path_1.basename(assets.main.css)), 'utf-8');
        expect(css).toMatch('margin:4px');
    });
    it('removes comments', () => {
        utilities_1.runBuild(fixture);
        const { assets } = fs_extra_1.readJSONSync(path_1.join(client, 'sewing-kit-manifest.json'));
        const css = fs_extra_1.readFileSync(path_1.join(client, path_1.basename(assets.main.css)), 'utf-8');
        expect(css).not.toMatch('Block comment');
        expect(css).not.toMatch('Inline comment');
    });
    it('uses short color names', () => {
        utilities_1.runBuild(fixture);
        const { assets } = fs_extra_1.readJSONSync(path_1.join(client, 'sewing-kit-manifest.json'));
        const css = fs_extra_1.readFileSync(path_1.join(client, path_1.basename(assets.main.css)), 'utf-8');
        expect(css).toMatch('color:#fff');
    });
});