"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../../utilities");
const nodeExternals = require('webpack-node-externals');
function externals({ env, config }) {
    const externalsPlugin = config.for('externals');
    if (externalsPlugin != null) {
        return externalsPlugin.externals;
    }
    if (env.isClient) {
        return null;
    }
    return utilities_1.flatten([nodeExternals({
        // Add any dependencies here that need to be processed by Webpack
        // source-map-support is always excluded so that it is embedded in
        // the server bundle
        whitelist: utilities_1.flatten([utilities_1.ifElse(env.hasProductionAssets, '@shopify/polaris'), 'source-map-support/register'])
    })]);
}
exports.default = externals;