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
const rawGlob = require("glob");
const util_1 = require("util");
const crypto_1 = require("crypto");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const js_yaml_1 = require("js-yaml");
const glob = util_1.promisify(rawGlob);
const get = require('lodash/get');
class Project {
    constructor(isRails, packageJSON, nodeModulesHash, devYaml, railgunYaml, hasPostCSSConfig, hasProcfile = false) {
        this.isRails = isRails;
        this.packageJSON = packageJSON;
        this.nodeModulesHash = nodeModulesHash;
        this.devYaml = devYaml;
        this.railgunYaml = railgunYaml;
        this.hasPostCSSConfig = hasPostCSSConfig;
        this.hasProcfile = hasProcfile;
    }
    get isNode() {
        return !this.isRails;
    }
    get usesDev() {
        return Boolean(this.devYaml);
    }
    get usesTypeScript() {
        return this.uses('typescript');
    }
    get usesPolaris() {
        return this.hasDependency('@shopify/polaris');
    }
    get usesReact() {
        return this.hasDependency('react') || this.usesPreactCompat;
    }
    get usesPreact() {
        return this.hasDependency('preact') && !this.usesPreactCompat;
    }
    get usesPreactCompat() {
        return this.hasDependency('preact-compat');
    }
    get devType() {
        return this.getDevKey('type');
    }
    get devYamlPort() {
        return this.getDevKey('server.port');
    }
    get devProxyHosts() {
        const hostnames = this.getRailgunKey('hostnames') || [];
        const proxyHosts = hostnames.filter(hostname => typeof hostname === 'object');
        const hostsMap = Object.values(proxyHosts).reduce((acc, host) => {
            const hostName = Object.keys(host)[0];
            acc.push({ host: hostName, port: host[hostName].proxy_to_host_port });
            return acc;
        }, []);
        if (hostsMap.length === 0) {
            return [];
        }
        const firstHost = hostsMap[0];
        const port = firstHost.port;
        return hostsMap.filter(host => {
            return host.port === port;
        });
    }
    get devPort() {
        // https://development.shopify.io/tools/dev/railgun/Railgun-Config#hostnames
        const hosts = this.devProxyHosts;
        return hosts.length > 0 ? hosts[0].port : undefined;
    }
    uses(dependency, versionCondition) {
        return this.hasDependency(dependency, versionCondition) || this.hasDevDependency(dependency, versionCondition);
    }
    hasDependency(dependency, versionCondition) {
        const version = this.packageJSON.dependencies[dependency];
        if (version == null) {
            return false;
        }
        return versionCondition == null || versionCondition.test(version);
    }
    hasDevDependency(dependency, versionCondition) {
        const version = this.packageJSON.devDependencies[dependency];
        if (version == null) {
            return false;
        }
        return versionCondition == null || versionCondition.test(version);
    }
    getDevKey(keyPath) {
        if (!this.usesDev) {
            return undefined;
        }
        return get(this.devYaml, keyPath, undefined);
    }
    getRailgunKey(keyPath) {
        if (!this.railgunYaml) {
            return undefined;
        }
        return get(this.railgunYaml, keyPath, undefined);
    }
}
exports.Project = Project;
function readYaml(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.pathExists(path))) {
            return false;
        }
        const result = yield js_yaml_1.safeLoad((yield fs_extra_1.readFile(path, 'utf8')));
        return result || false;
    });
}
function loadProject(root) {
    return __awaiter(this, void 0, void 0, function* () {
        const devPath = path_1.join(root, 'dev.yml');
        const devYaml = yield readYaml(devPath);
        const railgunPath = path_1.join(root, 'railgun.yml');
        const railgunYaml = Boolean(devYaml) && (yield readYaml(railgunPath));
        const packageJSON = Object.assign({ dependencies: {}, devDependencies: {} }, (yield fs_extra_1.readJSON(path_1.join(root, 'package.json'))));
        const yarnIntegrity = yield fs_extra_1.readFile(path_1.join(root, 'node_modules', '.yarn-integrity'));
        const nodeModulesHash = crypto_1.createHash('md5').update(yarnIntegrity).digest('hex');
        const isRails = yield fs_extra_1.pathExists(path_1.join(root, 'Gemfile'));
        const hasPostCSSConfig = yield fs_extra_1.pathExists(path_1.join(root, './postcss.config.js'));
        const hasProcfile = isRails && (yield glob('Procfile*(.*|)')).length > 0;
        return new Project(isRails, packageJSON, nodeModulesHash, devYaml, railgunYaml, hasPostCSSConfig, hasProcfile);
    });
}
exports.default = loadProject;