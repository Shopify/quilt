"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ServerSentEventConnectionManager {
    constructor(listener, { name = 'listener' } = {}) {
        this.name = name;
        this.listener = listener;
        this.lastConnectionKey = 0;
        this.connectionMap = {};
        listener.on('connection', connection => {
            const connectionKey = this.lastConnectionKey++;
            this.connectionMap[connectionKey] = connection;
            connection.on('close', () => {
                delete this.connectionMap[connectionKey];
            });
        });
    }
    sendHeaders(request, response) {
        request.connection.setKeepAlive(true);
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/event-stream;charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'Transfer-Encoding': 'identity',
            // While behind nginx, event stream should not be buffered:
            // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
            'X-Accel-Buffering': 'no'
        });
        response.write('\n');
    }
    sendStatus(status) {
        Object.values(this.connectionMap).forEach(client => {
            client.write(`data: ${JSON.stringify(status)}\n\n`);
        });
    }
    killAllConnections() {
        Object.values(this.connectionMap).forEach(connection => {
            connection.destroy();
        });
    }
    dispose({ logger }) {
        return new Promise(resolve => {
            if (this.listener == null) {
                resolve();
                return;
            }
            this.killAllConnections();
            logger.debug(chalk => `${chalk.bold(`[${this.name}]`)} Destroyed all connections`);
            this.listener.close(() => {
                this.killAllConnections();
                logger.debug(chalk => `${chalk.bold(`[${this.name}]`)} Closed listener`);
                resolve();
            });
        });
    }
}
exports.default = ServerSentEventConnectionManager;