"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const logger_1 = require("../logger");
const __1 = require("..");
describe('logger', () => {
    let logSpy;
    let warnSpy;
    let errorSpy;
    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log');
        warnSpy = jest.spyOn(console, 'warn');
        errorSpy = jest.spyOn(console, 'error');
    });
    afterEach(() => {
        logSpy.mockRestore();
        warnSpy.mockRestore();
        errorSpy.mockRestore();
    });
    it('defaults to Info verbosity', () => {
        const logger = new logger_1.default();
        logger.debug('debug message');
        logger.info('info message');
        logger.warn('warn message');
        logger.error(new Error('do not panic; this error is expected to appear in test output'));
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
    });
    it('logs all messages when set to debug verbosity', () => {
        const logger = new logger_1.default(__1.Verbosity.debug);
        logger.debug('debug message');
        logger.info('info message');
        logger.warn('warn message');
        logger.error(new Error('do not panic; this error is expected to appear in test output'));
        // `log` is called to output the error's stack trace in addition to debug and info.
        expect(logSpy).toHaveBeenCalledTimes(3);
        expect(warnSpy).toHaveBeenCalledTimes(1);
    });
    it('ignores non-errors when set to error verbosity', () => {
        const logger = new logger_1.default(__1.Verbosity.error);
        logger.debug('debug message');
        logger.info('info message');
        logger.warn('warn message');
        logger.error(new Error('do not panic; this error is expected to appear in test output'));
        expect(logSpy).not.toBeCalled();
        expect(warnSpy).not.toBeCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
    });
});