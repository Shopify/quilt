"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_markup_1 = require("./dashboard-markup");
class Dashboard {
    constructor(workspace, runner) {
        this.workspace = workspace;
        this.runner = runner;
        this.streamManager = null;
        this.state = {
            client: {
                state: null,
                assets: null
            },
            assetsBaseUrl: null
        };
    }
    middleware(publicPath) {
        const url = this.parseAssetPath(publicPath);
        this.state.assetsBaseUrl = url;
        return (_, response) => {
            const markup = dashboard_markup_1.dashboardMarkup(this.state);
            response.contentType('text/html').status(200).send(markup);
        };
    }
    listenToClient(client) {
        client.on('compile', () => {
            this.state.client.state = 'compile';
            this.sendStatus(this.state);
        }).on('done', stats => {
            const { output } = stats.compilation.compiler.options;
            const publicPath = output && output.publicPath || '/';
            const assets = stats.compilation.chunks.reduce((assets, { files }) => {
                const addFiles = Array.isArray(files) ? files : [files];
                assets.push(...addFiles);
                return assets;
            }, []).filter(asset => !asset.endsWith('.map')).map(asset => {
                return {
                    url: `${publicPath}${asset}`,
                    filename: asset.replace(/-[a-z0-9]{64}\./, '.')
                };
            });
            this.state.client.state = 'done';
            this.state.client.assets = assets;
            this.sendStatus(this.state);
        });
    }
    sendStatus(status) {
        if (this.streamManager) {
            this.streamManager.sendStatus(status);
        }
    }
    parseAssetPath(path) {
        const { project } = this.workspace;
        if (/^(https?:)?\/\/[a-zA-Z0-9]/.test(path)) {
            return path;
        }
        const host = project.devPort ? `https://${project.devProxyHosts[0].host}` : `http://localhost:8080`;
        return `${host}${path}`;
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.streamManager == null) {
                return;
            }
            yield this.streamManager.dispose(this.runner);
            this.streamManager = null;
        });
    }
}
exports.default = Dashboard;