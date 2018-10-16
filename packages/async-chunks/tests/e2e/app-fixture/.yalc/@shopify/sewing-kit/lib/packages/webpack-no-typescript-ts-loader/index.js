"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const TS_REGEX = /\.ts$/;
module.exports = function () {
    const extension = TS_REGEX.test(this.resourcePath) ? '.ts' : '.tsx';
    throw new Error(`sewing-kit could not parse ${chalk_1.default.bold(this.resourcePath.replace(this.rootContext, ''))} because ${extension} files depend on Typescript.\nIf this is a Typescript application, add Typescript as a dependency using ${chalk_1.default.bold('yarn add typescript')}`);
};