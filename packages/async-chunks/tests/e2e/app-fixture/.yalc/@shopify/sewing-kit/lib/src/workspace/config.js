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
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const allPlugins = require("../plugins");
const utilities_1 = require("../utilities");
const nodeObjectHash = require('node-object-hash');
const TYPESCRIPT_CONFIG_FILE_NAME = 'sewing-kit.config.ts';
const JAVASCRIPT_CONFIG_FILE_NAME = 'sewing-kit.config.js';
class Config {
    constructor(name, plugins = [], library = false) {
        this.name = name;
        this.plugins = plugins;
        this.library = library;
    }
    for(plugin) {
        const foundPlugin = this.plugins.find(({ plugin: aPlugin }) => aPlugin === plugin);
        if (!foundPlugin && plugin === 'experiments') {
            const experiments = allPlugins.experiments({});
            this.plugins.push(experiments);
            return experiments;
        }
        return foundPlugin;
    }
    get hash() {
        return nodeObjectHash({
            sort: false,
            coerce: false,
            alg: 'md5',
            enc: 'hex'
        }).hash(this);
    }
}
exports.Config = Config;
function loadConfig(configPath, env, project, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalConfigPath = configPath && path_1.resolve(configPath) || (yield getDefaultConfigPath(project));
        let config;
        if (finalConfigPath) {
            try {
                const configCallback = finalConfigPath.endsWith('.ts') ? yield readTypeScriptConfig(finalConfigPath, project) : require(finalConfigPath);
                config = configCallback(allPlugins, env);
            } catch (err) {
                runner.logger.error(err);
                runner.end();
                throw err;
            }
        }
        const { name, plugins, library } = config || {
            name: undefined,
            plugins: [],
            library: false
        };
        const finalName = name || finalConfigPath && path_1.basename(path_1.dirname(finalConfigPath)) || 'project';
        return new Config(finalName, plugins, library);
    });
}
exports.default = loadConfig;
function getDefaultConfigPath({ isRails }) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const configLocations = utilities_1.flatten([utilities_1.ifElse(isRails, path_1.join(cwd, 'config', TYPESCRIPT_CONFIG_FILE_NAME)), utilities_1.ifElse(isRails, path_1.join(cwd, 'config', JAVASCRIPT_CONFIG_FILE_NAME)), path_1.join(cwd, TYPESCRIPT_CONFIG_FILE_NAME), path_1.join(cwd, JAVASCRIPT_CONFIG_FILE_NAME)]);
        for (const configLocation of configLocations) {
            if (yield fs_extra_1.pathExists(configLocation)) {
                return configLocation;
            }
        }
        return false;
    });
}
function readTypeScriptConfig(configPath, { usesTypeScript }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!usesTypeScript) {
            const relativeConfigPath = path_1.relative(process.cwd(), configPath);
            const { default: chalk } = yield Promise.resolve().then(() => require('chalk'));
            throw new Error(`😿 To read ${chalk.bold(relativeConfigPath)}, sewing-kit needs a TypeScript compiler\n\nTypeScript can be installed using ${chalk.bold('yarn add typescript')}`);
        }
        const [fs, sourceMapSupport, ts] = yield Promise.all([Promise.resolve().then(() => require('fs-extra')), Promise.resolve().then(() => require('source-map-support')), Promise.resolve().then(() => require('typescript'))]);
        sourceMapSupport.install({
            // Scans for inline source-maps.
            hookRequire: true
        });
        const jsSrc = ts.transpileModule((yield fs.readFile(configPath, 'utf8')), {
            fileName: configPath,
            compilerOptions: {
                inlineSourceMap: true,
                isolatedModules: true,
                module: ts.ModuleKind.CommonJS,
                noEmit: true,
                skipLibCheck: true,
                target: ts.ScriptTarget.ES5
            }
        });
        const jsPath = path_1.join(path_1.dirname(configPath), '.sewing-kit.config.transpiled.tmp.js');
        fs.writeFileSync(jsPath, jsSrc.outputText);
        const configCallback = require(jsPath);
        fs.removeSync(jsPath);
        return configCallback.default || configCallback;
    });
}