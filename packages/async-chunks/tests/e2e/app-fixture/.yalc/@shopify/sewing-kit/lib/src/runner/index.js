"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
exports.Logger = logger_1.default;
exports.Verbosity = logger_1.Verbosity;
class Runner {
    constructor(logger = new logger_1.default()) {
        this.logger = logger;
        this.performed = new Map();
        process.on('unhandledRejection', error => {
            this.logger.error(error);
            this.fail();
        });
        process.on('uncaughtException', error => {
            this.logger.error(error);
            this.fail();
        });
    }
    fail() {
        process.stdout.write('\n');
        return process.exit(1);
    }
    end() {
        process.stdout.write('\n');
        return process.exit(0);
    }
    hasPerformed(task, workspace) {
        const valueForTask = this.performed.get(task);
        if (valueForTask == null) {
            return false;
        }
        if (valueForTask === true) {
            return true;
        }
        return workspace == null || valueForTask.includes(workspace);
    }
    perform(task, workspace) {
        if (this.hasPerformed(task, workspace)) {
            throw new Error(`You have already performed task ${task}`);
        }
        const valueForTask = this.performed.get(task) || [];
        if (valueForTask === true) {
            return;
        }
        if (workspace == null) {
            this.performed.set(task, true);
            return;
        }
        this.performed.set(task, [...valueForTask, workspace]);
    }
}
exports.default = Runner;