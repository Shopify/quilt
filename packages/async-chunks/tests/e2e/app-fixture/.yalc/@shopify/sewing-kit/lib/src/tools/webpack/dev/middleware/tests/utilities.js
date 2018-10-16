"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function mockRequest(overrides = {}) {
    const request = Object.assign({}, overrides);
    return request;
}
exports.mockRequest = mockRequest;
function mockResponse() {
    const response = {
        contentType: jest.fn(() => {
            return response;
        }),
        sendStatus: jest.fn(() => {
            return response;
        }),
        send: jest.fn(_ => {
            return response;
        }),
        setHeader: jest.fn(),
        status: jest.fn(_ => {
            return response;
        })
    };
    return response;
}
exports.mockResponse = mockResponse;
function mockStats(overrides) {
    const result = Object.assign({}, overrides);
    return result;
}
exports.mockStats = mockStats;