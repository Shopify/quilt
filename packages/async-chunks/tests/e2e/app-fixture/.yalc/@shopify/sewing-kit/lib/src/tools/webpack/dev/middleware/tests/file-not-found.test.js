"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const file_not_found_1 = require("../file-not-found");
const utilities_1 = require("./utilities");
describe('FileNotFound', () => {
    it('includes the failed request path', () => {
        const fileNotFound = new file_not_found_1.default('/');
        const response = utilities_1.mockResponse();
        fileNotFound.middleware(utilities_1.mockRequest({ path: '/foo/bar.js' }), response);
        expect(response.send).toHaveBeenCalledWith(expect.stringContaining('/foo/bar.js not found.'));
    });
    it('includes available asset hrefs', () => {
        const fileNotFound = new file_not_found_1.default('http://localhost/root/');
        const response = utilities_1.mockResponse();
        fileNotFound.update(utilities_1.mockStats({
            compilation: {
                chunks: [{ files: 'foo.js' }, { files: ['bar.js'] }]
            }
        }));
        fileNotFound.middleware({ path: '/foo/bar.js' }, response);
        expect(response.send).toHaveBeenCalledWith(expect.stringContaining('href="http://localhost/root/foo.js"'));
        expect(response.send).toHaveBeenCalledWith(expect.stringContaining('href="http://localhost/root/bar.js"'));
    });
    it('includes available asset names', () => {
        const fileNotFound = new file_not_found_1.default('/');
        const response = utilities_1.mockResponse();
        fileNotFound.update(utilities_1.mockStats({
            compilation: {
                chunks: [{
                    files: 'foo-aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff1234.js'
                }, {
                    files: 'bar-aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff1234.js'
                }]
            }
        }));
        fileNotFound.middleware({ path: '/foo/bar.js' }, response);
        expect(response.send).toHaveBeenCalledWith(expect.stringMatching(/<a[^>]+>foo\.js<\/a>/));
        expect(response.send).toHaveBeenCalledWith(expect.stringMatching(/<a[^>]+>bar\.js<\/a>/));
    });
});