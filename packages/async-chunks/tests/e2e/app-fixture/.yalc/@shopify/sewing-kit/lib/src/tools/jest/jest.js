"use strict";
// Unfortunately, we have to do this in order to stub jest out for
// testing (it's an unusual situation because we can't stub out the
// module that is running our tests, during our tests).

Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line jest/no-jest-import
const jestRunner = require('jest');
exports.default = jestRunner;