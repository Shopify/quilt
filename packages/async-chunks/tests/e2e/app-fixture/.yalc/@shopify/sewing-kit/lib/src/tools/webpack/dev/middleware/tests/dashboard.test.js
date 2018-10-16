"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../../env");
const runner_1 = require("../../../../../runner");
const dashboard_1 = require("../dashboard/dashboard");
const utilities_2 = require("./utilities");
const developmentClient = {
    env: new env_1.default({ mode: 'development', target: 'client' })
};
describe('Dashboard', () => {
    it('includes the assets base url', () => {
        const workspace = utilities_1.createWorkspace(developmentClient);
        const dashboard = new dashboard_1.default(workspace, new runner_1.default());
        const response = utilities_2.mockResponse();
        dashboard.middleware('/webpack/assets/')(utilities_2.mockRequest(), response, () => {});
        expect(response.send).toHaveBeenCalledWith(expect.stringContaining('>http://localhost:8080/webpack/assets/<'));
    });
    describe('client state', () => {
        describe('initial', () => {
            it('shows "Getting started" message', () => {
                const workspace = utilities_1.createWorkspace(developmentClient);
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                const response = utilities_2.mockResponse();
                dashboard.middleware('/assets/')(utilities_2.mockRequest(), response, () => {});
                const sendMock = response.send.mock;
                const responseMarkup = sendMock.calls[0][0];
                const { document } = new jsdom_1.JSDOM(responseMarkup).window;
                const clientAssetNode = document.querySelector('div#client-assets-card');
                expect(clientAssetNode && clientAssetNode.innerHTML).toContain('🏃‍♀️ Getting started...');
            });
        });
        describe('compile', () => {
            it('shows compilation message', () => {
                const workspace = utilities_1.createWorkspace(developmentClient);
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                dashboard.state.client.state = 'compile';
                const response = utilities_2.mockResponse();
                dashboard.middleware('/assets/')(utilities_2.mockRequest(), response, () => {});
                const sendMock = response.send.mock;
                const responseMarkup = sendMock.calls[0][0];
                const { document } = new jsdom_1.JSDOM(responseMarkup).window;
                const clientAssetsNode = document.querySelector('div#client-assets-card');
                expect(clientAssetsNode && clientAssetsNode.innerHTML).toContain('🔨 Compiling client assets...');
            });
        });
        describe('done', () => {
            it('shows a list of all client assets', () => {
                const workspace = utilities_1.createWorkspace(developmentClient);
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                dashboard.state.client.state = 'done';
                dashboard.state.client.assets = [{ url: 'https://my.cdn.com/webpack/assets/foo.js', filename: 'foo.js' }, { url: 'https://my.cdn.com/webpack/assets/bar.js', filename: 'bar.js' }];
                const response = utilities_2.mockResponse();
                dashboard.middleware('/assets/')(utilities_2.mockRequest(), response, () => {});
                const sendMock = response.send.mock;
                const responseMarkup = sendMock.calls[0][0];
                const { document } = new jsdom_1.JSDOM(responseMarkup).window;
                const clientAssetsLinks = Array.from(document.querySelectorAll('div#client-assets-card a.Polaris-Link'));
                const linksArray = Array.from(clientAssetsLinks);
                const fileNames = linksArray.map(link => link.innerHTML);
                const urls = linksArray.map(link => link.href);
                expect(fileNames).toEqual(['foo.js', 'bar.js']);
                expect(urls).toEqual(['https://my.cdn.com/webpack/assets/foo.js', 'https://my.cdn.com/webpack/assets/bar.js']);
            });
        });
        describe('#parseAssetPath', () => {
            it('returns fully-qualified http URLs without changes', () => {
                const workspace = utilities_1.createWorkspace();
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                expect(dashboard.parseAssetPath('http://foo.com:8080/bar/')).toBe('http://foo.com:8080/bar/');
            });
            it('returns fully-qualified https URLs without changes', () => {
                const workspace = utilities_1.createWorkspace();
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                expect(dashboard.parseAssetPath('https://foo.com:8080/bar/')).toBe('https://foo.com:8080/bar/');
            });
            it('returns protocol-relative URLs without changes', () => {
                const workspace = utilities_1.createWorkspace();
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                expect(dashboard.parseAssetPath('//foo.com:8080/bar/')).toBe('//foo.com:8080/bar/');
            });
        });
        describe('without railgun', () => {
            it('prepends the default asset host to paths', () => {
                const workspace = utilities_1.createWorkspace();
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                expect(dashboard.parseAssetPath('/foo/bar/')).toBe('http://localhost:8080/foo/bar/');
            });
        });
        describe('with railgun', () => {
            it('prepends railgun host to paths', () => {
                const workspace = utilities_1.createWorkspace(Object.assign({}, developmentClient, { devYaml: {}, railgunYaml: {
                        hostnames: [
                        // eslint-disable-next-line camelcase
                        { 'foo.myshopify.io': { proxy_to_host_port: 1234 } }]
                    } }));
                const dashboard = new dashboard_1.default(workspace, new runner_1.default());
                expect(dashboard.parseAssetPath('/bar/qux/')).toBe('https://foo.myshopify.io/bar/qux/');
            });
        });
    });
});