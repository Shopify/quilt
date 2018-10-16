"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utilities_1 = require("../../../utilities");
const utilities_2 = require("../utilities");
function entry({ env, project, paths, config }) {
    const entryConfig = config.for('entry');
    const sassConfig = config.for('sass');
    let entries = entryConfig ? entryConfig.entries : utilities_1.ifElse(project.isNode, path.join(paths.root, env.target), paths.app);
    if (env.isServer) {
        entries = utilities_2.prependToEntries(entries, 'source-map-support/register');
    }
    if (env.isClient) {
        entries = utilities_2.prependToEntries(entries, 'regenerator-runtime/runtime');
    }
    const autoImportPolaris = !sassConfig || sassConfig.autoImportPolaris;
    if (project.usesPolaris && env.isClient && autoImportPolaris) {
        const shouldImportComponents = Array.isArray(autoImportPolaris) && autoImportPolaris.includes('components') || autoImportPolaris === true;
        const shouldImportGlobal = Array.isArray(autoImportPolaris) && autoImportPolaris.includes('global') || autoImportPolaris === true;
        if (!env.hasProductionAssets && shouldImportComponents) {
            entries = utilities_2.prependToEntries(entries, '@shopify/polaris/styles/components.scss');
        }
        if (shouldImportGlobal) {
            entries = utilities_2.prependToEntries(entries, env.isDevelopment || env.isTest ? '@shopify/polaris/styles/global.scss' : '@shopify/polaris/esnext/styles/global.scss');
        }
    }
    return entries;
}
exports.default = entry;