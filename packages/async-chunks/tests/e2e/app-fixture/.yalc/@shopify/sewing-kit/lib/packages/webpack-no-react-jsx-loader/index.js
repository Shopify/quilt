"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("loader-utils");
const chalk_1 = require("chalk");
const JSX_REGEX = /\.jsx$/;
module.exports = function () {
    const extension = JSX_REGEX.test(this.resourcePath) ? '.jsx' : '.tsx';
    const options = loader_utils_1.getOptions(this);
    throw new Error(`sewing-kit could not parse ${chalk_1.default.bold(this.resourcePath.replace(options.root, ''))} because ${extension} files depend on React.\nIf this is a React application, add React's libraries using ${chalk_1.default.bold('yarn add react react-dom')}`);
};