"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utilities_1 = require("../../../utilities");
function resolve(workspace) {
    const { env, paths, project: { usesPreactCompat, usesPolaris } } = workspace;
    return utilities_1.removeEmptyValues({
        // eslint-disable-next-line no-warning-comments
        // TODO: check if these need to actually exist before being included
        modules: utilities_1.flatten([paths.packages, 'node_modules', paths.app]),
        extensions: utilities_1.flatten(['.js', '.jsx', '.json', '.ts', '.tsx']),
        mainFields: utilities_1.ifElse(env.isServer, ['jsnext:main', 'module', 'main'], ['browser', 'jsnext:main', 'module', 'main']),
        alias: Object.assign({}, utilities_1.ifElse(env.hasProductionAssets && usesPolaris, {
            '@shopify/polaris$': path.join(paths.nodeModules, '@shopify/polaris/esnext'),
            '@shopify/polaris/styles.scss': path.join(paths.nodeModules, '@shopify/polaris/esnext/styles.scss'),
            '@shopify/polaris/styles': path.join(paths.nodeModules, '@shopify/polaris/esnext/styles')
        }), utilities_1.ifElse(usesPreactCompat, {
            react: 'preact-compat',
            'react-dom': 'preact-compat',
            'preact-compat': 'preact-compat/dist/preact-compat'
        }))
    });
}
exports.default = resolve;