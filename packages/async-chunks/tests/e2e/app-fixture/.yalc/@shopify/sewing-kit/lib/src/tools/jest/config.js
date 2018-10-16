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
const path = require("path");
const utilities_1 = require("../../utilities");
const utilities_2 = require("../utilities");
function jestConfig(workspace, { testDirectories } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { root, paths, project: { usesPolaris, usesTypeScript, usesReact, usesPreact } } = workspace;
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        const semver = yield Promise.resolve().then(() => require('semver'));
        const watchPluginsSupported = semver.gte(require('jest/package.json').version, '22.0.0');
        const fileMatcher = usesPolaris ? '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|csv|ico)$' : '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|csv|ico)$';
        const transformsRoot = path.join(paths.sewingKit, 'jest', 'transformers');
        const defaultConfig = {
            bail: false,
            rootDir: root,
            roots: testDirectories,
            setupFiles: utilities_1.flatten([path.join(paths.sewingKit, 'jest', 'polyfills.js')]),
            globals: utilities_1.removeEmptyValues({
                'ts-jest': utilities_1.ifElse(usesTypeScript, {
                    useBabelrc: false,
                    babelConfig: {
                        // Can't just flatten here because we need multiple
                        // levels of array
                        presets: [['shopify/node', { modules: 'commonjs' }]].concat(usesReact ? ['shopify/react'] : [], usesPreact ? [['shopify/react', { pragma: 'h' }]] : []),
                        plugins: ['system-import-transformer'],
                        sourceMaps: 'inline'
                    }
                })
            }),
            moduleFileExtensions: utilities_1.flatten([utilities_1.ifElse(usesTypeScript, ['ts', 'tsx']), 'js', 'json']),
            modulePaths: utilities_1.flatten([path.join('<rootDir>', path.relative(paths.root, paths.app)), paths.packages && path.join('<rootDir>', path.relative(paths.root, paths.packages))]),
            testRegex: '.*\\.(test|integration)\\.(js|ts)x?$',
            transform: utilities_1.removeEmptyStringValues({
                '\\.jsx?$': path.join(transformsRoot, 'javascript.js'),
                '\\.tsx?$': utilities_1.ifElse(usesTypeScript, require.resolve('ts-jest/preprocessor.js')),
                '\\.svg$': utilities_1.ifElse(usesPolaris, path.join(transformsRoot, 'svg.js')),
                '\\.(gql|graphql)$': utilities_1.ifElse(usesGraphQL, require.resolve('jest-transform-graphql')),
                [fileMatcher]: path.join(transformsRoot, 'file.js')
            }),
            moduleNameMapper: {
                '\\.s?css$': path.join(transformsRoot, 'styles.js'),
                '^tests/(.*)': path.join(paths.tests, '$1')
            },
            collectCoverage: false,
            collectCoverageFrom: utilities_2.projectSourceDirectories(workspace).reduce((arr, dir) => {
                arr.push(`${dir}/**/*.{js,jsx,ts,tsx}`);
                arr.push(`!${dir}/**/index.{js,jsx,ts,tsx}`);
                return arr;
            }, []),
            coverageDirectory: undefined,
            watchPlugins: utilities_1.ifElse(watchPluginsSupported, ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'])
        };
        const sanitizedConfig = utilities_1.removeEmptyValues(defaultConfig);
        const jestConfig = workspace.config.for('jest');
        return jestConfig ? jestConfig.configure(sanitizedConfig) : sanitizedConfig;
    });
}
exports.default = jestConfig;