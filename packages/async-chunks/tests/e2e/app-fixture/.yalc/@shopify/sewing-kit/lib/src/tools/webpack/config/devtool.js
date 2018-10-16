"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function devtool({ env, project }, { sourceMaps }) {
    if (env.isServer) {
        if (env.hasProductionAssets) {
            return 'source-map';
        } else if (sourceMaps === 'off') {
            return undefined;
        } else {
            return 'hidden-source-map';
        }
    } else {
        if (env.hasProductionAssets) {
            return 'hidden-source-map';
        }
        return {
            accurate: 'source-map',
            fast: project.usesReact ? 'cheap-module-source-map' : 'eval',
            off: undefined
        }[sourceMaps];
    }
}
exports.devtool = devtool;