"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Env {
    constructor({ target = 'client', mode = defaultMode() } = {}) {
        this.target = target;
        this.mode = mode;
    }
    get hasProductionAssets() {
        return this.isProduction || this.isStaging;
    }
    get isClient() {
        return this.target === 'client';
    }
    get isServer() {
        return this.target === 'server';
    }
    get isProduction() {
        return this.mode === 'production';
    }
    get isDevelopment() {
        return this.mode === 'development';
    }
    get isNotDevelopment() {
        return !this.isDevelopment;
    }
    get isStaging() {
        return this.mode === 'staging';
    }
    get isTest() {
        return this.mode === 'test';
    }
    get isCircleCI() {
        return process.env.CIRCLECI === 'true';
    }
    get isCI() {
        return process.env.CI === 'true' || process.env.CI === '1';
    }
    get isDevelopmentClient() {
        return this.isDevelopment && this.isClient;
    }
    get isProductionClient() {
        throw new Error('env.isProductionClient has been removed.  Use env.isClient && env.hasProductionAssets instead');
    }
    get isTestClient() {
        return this.isTest && this.isClient;
    }
    get isDevelopmentServer() {
        return this.isDevelopment && this.isServer;
    }
    get isProductionServer() {
        throw new Error('env.isProductionServer has been removed.  Use env.isServer && env.hasProductionAssets instead');
    }
    get isShopifyBuild() {
        return process.env.SHOPIFY_BUILD_VERSION != null;
    }
    get isTestServer() {
        return this.isTest && this.isServer;
    }
    toString() {
        return `${this.mode} ${this.target}`;
    }
}
exports.default = Env;
function defaultMode() {
    return process.env.NODE_ENV || 'production';
}