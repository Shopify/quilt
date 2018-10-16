"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("./utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'async-chunks-manifest');
const build = path_1.resolve(fixture, 'build');
const client = path_1.resolve(build, 'client');
const manifestPath = path_1.resolve(client, 'async-chunks.json');
function getManifestChunks(chunk) {
    return fs_extra_1.readJsonSync(manifestPath)[chunk];
}
describe('async chunks manifest', () => {
    afterAll(() => fs_extra_1.removeSync(build));
    afterEach(() => {
        fs_extra_1.removeSync(client);
    });
    it('generates the async-chunks manifest', () => {
        utilities_1.runClientBuild(fixture);
        expect(fs_extra_1.existsSync(manifestPath)).toBe(true);
    });
    describe('synchronous chunks', () => {
        it('includes only one bundle for the app chunk', () => {
            utilities_1.runClientBuild(fixture);
            const bundle = getManifestChunks('../app/components/app');
            expect(bundle).toHaveLength(1);
            expect(bundle[0]).toMatchObject({
                chunkName: 'app',
                file: expect.stringMatching(/^app-[a-f0-9]{64}.js$/),
                integrity: expect.stringMatching(/sha256-.{44}$/),
                publicPath: expect.stringMatching(/assets\/app-[a-f0-9]{64}.js$/)
            });
        });
    });
    describe('asynchronous chunks', () => {
        it('includes 2 bundles for the asyncFoo chunk', () => {
            utilities_1.runClientBuild(fixture);
            const bundle = getManifestChunks('./foo');
            expect(bundle).toHaveLength(2);
        });
        it('includes the css bundle', () => {
            utilities_1.runClientBuild(fixture);
            const bundle = getManifestChunks('./foo').find(chunk => chunk.file.endsWith('.css'));
            expect(bundle).toMatchObject({
                chunkName: 'asyncFoo',
                id: null,
                file: expect.stringMatching(/^asyncFoo-[a-f0-9]{64}.css$/),
                integrity: expect.stringMatching(/sha256-.{44}$/),
                publicPath: expect.stringMatching(/assets\/asyncFoo-[a-f0-9]{64}.css$/)
            });
        });
        it('includes the js bundle', () => {
            utilities_1.runClientBuild(fixture);
            const bundle = getManifestChunks('./foo').find(chunk => chunk.file.endsWith('.js'));
            expect(bundle).toMatchObject({
                chunkName: 'asyncFoo',
                file: expect.stringMatching(/^asyncFoo-[a-f0-9]{64}.js$/),
                integrity: expect.stringMatching(/sha256-.{44}$/),
                publicPath: expect.stringMatching(/assets\/asyncFoo-[a-f0-9]{64}.js$/)
            });
        });
        it('omits integrity sha in development builds', () => {
            utilities_1.runClientBuild(fixture, { '--mode': 'development' });
            const bundle = getManifestChunks('./foo').find(chunk => chunk.file.endsWith('.js'));
            expect(bundle).not.toHaveProperty('integrity');
        });
    });
});