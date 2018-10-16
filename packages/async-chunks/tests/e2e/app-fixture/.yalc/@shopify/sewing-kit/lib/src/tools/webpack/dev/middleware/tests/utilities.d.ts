/// <reference types="jest" />
import { Request, Response } from 'express';
import { Stats } from 'webpack';
declare type Mocked<T> = {
    [K in keyof T]: jest.Mock;
};
export declare function mockRequest(overrides?: object): Request;
export declare function mockResponse(): Mocked<Partial<Response>> & Response;
export declare function mockStats(overrides: object): Stats;
export {};
