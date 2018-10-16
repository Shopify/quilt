"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('utilities', () => {
    describe('msToMinutesAndSeconds', () => {
        describe('less than 60 seconds', () => {
            it('omits minutes', () => {
                expect(__1.msToMinutesAndSeconds(59009)).toEqual('59s');
            });
            it('does not 0-pad seconds', () => {
                expect(__1.msToMinutesAndSeconds(9000)).toEqual('9s');
            });
            it('rounds down to nearest second', () => {
                expect(__1.msToMinutesAndSeconds(59499)).toEqual('59s');
            });
            it('rounds up to nearest minute', () => {
                expect(__1.msToMinutesAndSeconds(59999)).toEqual('1m00s');
            });
        });
        describe('more than 60 seconds', () => {
            it('0-pads seconds', () => {
                expect(__1.msToMinutesAndSeconds(69000)).toEqual('1m09s');
            });
            it('0-pads whole minutes', () => {
                expect(__1.msToMinutesAndSeconds(60000)).toEqual('1m00s');
            });
            it('does not zero-pad more than 9 seconds', () => {
                expect(__1.msToMinutesAndSeconds(70000)).toEqual('1m10s');
            });
        });
    });
});