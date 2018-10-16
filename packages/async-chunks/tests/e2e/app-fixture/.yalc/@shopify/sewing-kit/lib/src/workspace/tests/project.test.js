"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../project");
describe('Project', () => {
    describe('typescript', () => {
        it('is enabled when typescript is in devDependencies', () => {
            const project = new project_1.Project(false, { dependencies: {}, devDependencies: { typescript: 'latest' } }, '', false, false, false);
            expect(project.usesTypeScript).toBe(true);
        });
        it('is enabled when typescript is in dependencies', () => {
            const project = new project_1.Project(false, { dependencies: { typescript: 'latest' }, devDependencies: {} }, '', false, false, false);
            expect(project.usesTypeScript).toBe(true);
        });
        it('is disabled when typescript is omitted', () => {
            const project = new project_1.Project(false, packageJSON(), '', false, false, false);
            expect(project.usesTypeScript).toBe(false);
        });
    });
    describe('devProxyHosts', () => {
        it('is empty when railgun.yml does not exist', () => {
            const project = new project_1.Project(false, packageJSON(), '', false, false, false);
            expect(project.devProxyHosts).toEqual([]);
        });
        it('is empty when railgun.yml contains no proxied hosts', () => {
            const project = new project_1.Project(false, packageJSON(), '', false, {
                hostnames: ['foo.myshopify.io', 'bar.myshopify.io']
            }, false);
            expect(project.devProxyHosts).toEqual([]);
        });
        it('returns hosts proxied to first listed port', () => {
            const project = new project_1.Project(false, packageJSON(), '', false, {
                hostnames: ['foo.myshopify.io',
                // eslint-disable-next-line camelcase
                { 'bar.myshopify.io': { proxy_to_host_port: 10 } },
                // eslint-disable-next-line camelcase
                { 'baz.myshopify.io': { proxy_to_host_port: 20 } },
                // eslint-disable-next-line camelcase
                { 'qux.myshopify.io': { proxy_to_host_port: 10 } }]
            }, false);
            expect(project.devProxyHosts).toEqual([{ host: 'bar.myshopify.io', port: 10 }, { host: 'qux.myshopify.io', port: 10 }]);
        });
    });
    describe('devPort', () => {
        it('is undefined when there is nothing to base it on', () => {
            const project = new project_1.Project(false, packageJSON(), '', false, false, false);
            expect(project.devPort).toBeUndefined();
        });
        describe('with Railgun config', () => {
            it('is undefined when there are no hostnames', () => {
                const project = new project_1.Project(false, packageJSON(), '', false, {}, false);
                expect(project.devPort).toBeUndefined();
            });
            it('uses the first non-string hostname’s proxy', () => {
                const project = new project_1.Project(false, packageJSON(), '', false, {
                    hostnames: ['foo.myshopify.io',
                    // eslint-disable-next-line camelcase
                    { 'bar.myshopify.io': { proxy_to_host_port: 10 } },
                    // eslint-disable-next-line camelcase
                    { 'baz.myshopify.io': { proxy_to_host_port: 20 } }]
                }, false);
                expect(project.devPort).toBe(10);
            });
        });
        describe('usesReact', () => {
            it('is enabled if react is present in the dependencies', () => {
                const project = new project_1.Project(false, { dependencies: { react: 'latest' }, devDependencies: {} }, '', false, false, false);
                expect(project.usesReact).toBe(true);
            });
            it('is enabled if preact-compat is present in the dependencies', () => {
                const project = new project_1.Project(false, { dependencies: { 'preact-compat': 'latest' }, devDependencies: {} }, '', false, false, false);
                expect(project.usesReact).toBe(true);
            });
        });
        describe('usesPreact', () => {
            it('is enabled if preact is present in the dependencies', () => {
                const project = new project_1.Project(false, { dependencies: { preact: 'latest' }, devDependencies: {} }, '', false, false, false);
                expect(project.usesPreact).toBe(true);
            });
            it('is disabled if preact-compat is used in the dependencies', () => {
                const project = new project_1.Project(false, {
                    dependencies: { preact: 'latest', 'preact-compat': 'latest' },
                    devDependencies: {}
                }, '', false, false, false);
                expect(project.usesPreact).toBe(false);
            });
        });
        describe('hasProcfile', () => {
            it('uses value when passed into constructor', () => {
                const project = new project_1.Project(false, { dependencies: {}, devDependencies: {} }, '', false, false, false, true);
                expect(project.hasProcfile).toBe(true);
            });
            it('defaults to false', () => {
                const project = new project_1.Project(false, { dependencies: {}, devDependencies: {} }, '', false, false, false);
                expect(project.hasProcfile).toBe(false);
            });
        });
    });
});
function packageJSON() {
    return { dependencies: {}, devDependencies: {} };
}