"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("tests/unit/utilities");
const plugins_1 = require("../../../../plugins");
const vendor_dll_1 = require("../vendor-dll");
const runner_1 = require("../../../../runner");
jest.mock('webpack', () => {
    const webpack = jest.fn(() => {
        return {
            run: jest.fn()
        };
    });
    webpack.DllPlugin = function () {
        return {};
    };
    return webpack;
});
const webpack = require.requireMock('webpack');
describe('vendor-dll', () => {
    beforeEach(() => {
        webpack.mockClear();
    });
    it('makes troubleshooting easy by using unminified libraries', () => {
        const workspace = utilities_1.createWorkspace({
            plugins: [plugins_1.vendors(['foo', 'bar', 'qux'])]
        });
        vendor_dll_1.default(workspace, new runner_1.default());
        expect(webpack).toHaveBeenCalledWith(expect.objectContaining({ mode: 'development' }));
    });
    it('accepts packages from the workspace', () => {
        const workspace = utilities_1.createWorkspace({
            plugins: [plugins_1.vendors(['foo', 'bar', 'qux'])]
        });
        expect(vendor_dll_1.getVendorModules(workspace)).toEqual(['foo', 'bar', 'qux']);
    });
    it('facilitates hot reloading by rejecting react-hot-loader', () => {
        const workspace = utilities_1.createWorkspace({
            plugins: [plugins_1.vendors(['foo', 'react-hot-loader'])]
        });
        expect(vendor_dll_1.getVendorModules(workspace)).toEqual(['foo']);
    });
    it('excludes packages without entrypoints', () => {
        const workspace = utilities_1.createWorkspace({
            plugins: [plugins_1.vendors(['bar', '@shopify/javascript-utilities'])]
        });
        expect(vendor_dll_1.getVendorModules(workspace)).toEqual(['bar']);
    });
    it('excludes packages that require node packages', () => {
        const workspace = utilities_1.createWorkspace({
            plugins: [plugins_1.vendors(['bar', '@shopify/sewing-kit-server'])]
        });
        expect(vendor_dll_1.getVendorModules(workspace)).toEqual(['bar']);
    });
    it('uses es5-compatible builds to minimize webpack config complexity', () => {
        const workspace = utilities_1.createWorkspace({
            plugins: [plugins_1.vendors(['foo'])]
        });
        vendor_dll_1.default(workspace, new runner_1.default());
        expect(webpack).toHaveBeenCalledWith(expect.objectContaining({
            resolve: {
                mainFields: ['browser', 'main']
            }
        }));
    });
});