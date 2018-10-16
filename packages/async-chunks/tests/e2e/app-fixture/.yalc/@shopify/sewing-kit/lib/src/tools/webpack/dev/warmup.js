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
const express = require("express");
const utilities_1 = require("../utilities");
const server_sent_event_stream_manager_1 = require("./server-sent-event-stream-manager");
const warmup_markup_1 = require("./warmup-markup");
const stripAnsi = require('strip-ansi');
class Warmup {
    constructor(workspace, runner) {
        this.workspace = workspace;
        this.runner = runner;
        this.streamManager = null;
        this.lastStatus = {
            message: 'Bundles are being built.'
        };
    }
    start() {
        const { ip = 'localhost', port = 8081 } = this.workspace.config.for('devServer') || {};
        const app = express();
        app.get('*/sk-status', (request, response) => {
            // eslint-disable-next-line typescript/no-non-null-assertion
            this.streamManager.sendHeaders(request, response);
            this.sendStatus(this.lastStatus);
        });
        app.get('*', (request, response) => {
            const referer = request.headers.referer;
            response.send(warmup_markup_1.warmupMarkup(this.workspace, referer));
        });
        const listener = app.listen(port, ip, () => {
            this.runner.logger.info(chalk => `${chalk.bold('[warmup]')} Ready to accept requests: ${ip}:${port}`);
        });
        this.streamManager = new server_sent_event_stream_manager_1.default(listener, { name: 'warmup' });
    }
    sendStatus(status) {
        if (this.streamManager) {
            this.lastStatus = status;
            this.streamManager.sendStatus(status);
        }
    }
    listenToClient(client) {
        client.on('compile', () => {
            this.sendStatus({ message: '🔨  Compiling client' });
        }).on('compile-failed', error => {
            this.sendStatus({
                message: '😬  Client compilation failed',
                errors: [error.message || error.toString()]
            });
        }).on('compile-error', stats => {
            const messages = utilities_1.formatWebpackMessages(stats);
            this.sendStatus({
                message: '😬  Client compilation failed',
                errors: [...messages.errors, ...messages.warnings].map(stripAnsi)
            });
        }).on('done', () => {
            const { config, project } = this.workspace;
            const experiments = config.for('experiments');
            const hasServer = project.isNode || experiments && experiments.railsWithNodeServer;
            if (!hasServer) {
                this.sendStatus({ message: '✅  Done!', warmupComplete: true });
            }
        });
    }
    listenToServer(server) {
        server.on('compile', () => {
            this.sendStatus({ message: '🛠  Compiling server' });
        }).on('compile-error', (stats, clientStats) => {
            const messages = utilities_1.formatWebpackMessages(stats, clientStats);
            this.sendStatus({
                message: '😬  Server compilation failed',
                errors: [...messages.errors, ...messages.warnings].map(stripAnsi)
            });
        }).on('compile-failed', error => {
            this.sendStatus({
                message: '😬  Server compilation failed',
                errors: [error.message || error.toString()]
            });
        }).on('done', () => {
            this.sendStatus({ message: '✅  Done!', warmupComplete: true });
        });
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
exports.default = Warmup;