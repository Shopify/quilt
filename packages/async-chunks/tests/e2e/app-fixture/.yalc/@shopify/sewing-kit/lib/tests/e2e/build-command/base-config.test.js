"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("tests/e2e/utilities");
const utilities_2 = require("./utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'base-config');
const build = path_1.resolve(fixture, 'build');
const client = path_1.resolve(build, 'client');
const server = path_1.resolve(build, 'server');
function getClientAssets(path) {
    return fs_extra_1.readdirSync(path).map(file => file.replace(/-[^-]{64}/, '')).sort();
}
describe('base config', () => {
    afterAll(() => fs_extra_1.removeSync(build));
    afterEach(() => {
        fs_extra_1.removeSync(client);
        fs_extra_1.removeSync(server);
    });
    it('generates the build/client files', () => {
        utilities_2.runClientBuild(fixture);
        expect(getClientAssets(client)).toEqual(['assets.json', 'main.css', 'main.css.map', 'main.js', 'main.js.map', 'runtime.js', 'runtime.js.map']);
    });
    it('generates the build/server files', () => {
        utilities_2.runServerBuild(fixture);
        expect(fs_extra_1.readdirSync(server).sort()).toEqual(['assets.json', 'main.js', 'main.js.map']);
    });
    it('generates a valid sha256 checksum on production filenames', () => {
        utilities_2.runClientBuild(fixture);
        const assets = path_1.resolve(client, 'assets.json');
        const { js, css } = JSON.parse(fs_extra_1.readFileSync(assets, 'utf8')).assets.main;
        expect(utilities_1.hashFile(client, path_1.basename(js))).toEqual(path_1.basename(js).split(/[-.]/)[1]);
        expect(utilities_1.hashFile(client, path_1.basename(css))).toEqual(path_1.basename(css).split(/[-.]/)[1]);
    });
    // A webpack@4 workaround forced `main.js` to be hardcoded as the server bundle name.
    // eslint-disable-next-line no-warning-comments
    // TODO: enable this test once https://github.com/Shopify/sewing-kit/issues/626 is fixed
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should use a custom config when specified with --config', () => {
        utilities_2.runServerBuild(fixture, { '--config': './custom.config.js' });
        expect(fs_extra_1.existsSync(path_1.resolve(server, 'foo.js'))).toBe(true);
    });
});