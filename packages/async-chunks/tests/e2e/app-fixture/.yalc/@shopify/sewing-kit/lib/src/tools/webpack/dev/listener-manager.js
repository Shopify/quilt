"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ListenerManager {
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
exports.default = ListenerManager;