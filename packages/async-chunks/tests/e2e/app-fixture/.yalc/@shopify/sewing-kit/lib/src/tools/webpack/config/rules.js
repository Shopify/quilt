"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const optimize_1 = require("@shopify/images/optimize");
// This import is useless, but our build scripts need it in order to actually generate
// the JS from this package.
require("../../../../../lib/packages/webpack-section-focus-loader");
require("../../../../../lib/packages/webpack-no-typescript-ts-loader");
require("../../../../../lib/packages/webpack-no-react-jsx-loader");
const utilities_1 = require("../../../utilities");
const utilities_2 = require("./utilities");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const POLARIS_CSS_MINIFIED_FORMAT = 'p_[hash:base64:5]';
function sass(workspace, { sourceMap }) {
    const { env, project, paths } = workspace;
    const rules = [];
    const polarisRoot = env.hasProductionAssets ? path_1.join(paths.nodeModules, '@shopify/polaris', 'esnext') : path_1.join(paths.nodeModules, '@shopify/polaris');
    if (project.usesPolaris) {
        if (env.isServer || env.isTest) {
            rules.push({
                test: /\.scss$/,
                include: [polarisRoot],
                use: utilities_1.flatten([{
                    loader: 'cache-loader',
                    options: {
                        cacheDirectory: path_1.join(paths.cache, 'webpack', `polaris-scss-${env.mode}-${env.target}`),
                        cacheIdentifier: `sewing-kit@${project.nodeModulesHash}`
                    }
                }, {
                    loader: 'css-loader/locals',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: utilities_1.ifElse(env.hasProductionAssets, POLARIS_CSS_MINIFIED_FORMAT, '[local]')
                    }
                }, {
                    loader: 'sass-loader',
                    options: utilities_1.removeEmptyValues({
                        includePaths: utilities_2.sassIncludePaths(workspace)
                    })
                }, utilities_2.sassGlobalsLoader(workspace)])
            });
        } else if (env.isClient && env.hasProductionAssets) {
            rules.push({
                test: /\.scss$/,
                include: [polarisRoot],
                use: utilities_1.flatten([MiniCssExtractPlugin.loader, {
                    loader: 'cache-loader',
                    options: {
                        cacheDirectory: path_1.join(paths.cache, 'webpack', `polaris-scss-${env.mode}-${env.target}`),
                        cacheIdentifier: `sewing-kit@${project.nodeModulesHash}`
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap,
                        minimize: true,
                        modules: true,
                        importLoaders: 1,
                        localIdentName: POLARIS_CSS_MINIFIED_FORMAT
                    }
                }, {
                    loader: 'postcss-loader',
                    options: utilities_1.removeEmptyValues({
                        config: utilities_1.ifElse(!project.hasPostCSSConfig, {
                            path: paths.defaultPostCSSConfig
                        }),
                        sourceMap
                    })
                }, {
                    loader: 'sass-loader',
                    options: utilities_1.removeEmptyValues({
                        sourceMap,
                        includePaths: utilities_2.sassIncludePaths(workspace)
                    })
                }, utilities_2.sassGlobalsLoader(workspace)])
            });
        } else {
            rules.push({
                test: /\.scss$/,
                include: [polarisRoot],
                use: ['happypack/loader?id=polaris-styles']
            });
        }
    }
    if (env.isServer || env.isTest) {
        rules.push({
            test: /\.scss$/,
            exclude: /node_modules/,
            use: utilities_1.flatten([{
                loader: 'cache-loader',
                options: {
                    cacheDirectory: path_1.join(paths.cache, 'webpack', `app-scss-${env.mode}-${env.target}`),
                    cacheIdentifier: `sewing-kit@${project.nodeModulesHash}`
                }
            }, {
                loader: 'css-loader/locals',
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: utilities_1.ifElse(env.hasProductionAssets, '[hash:base64:5]', '[name]-[local]_[hash:base64:5]')
                }
            }, {
                loader: 'sass-loader',
                options: utilities_1.removeEmptyValues({
                    includePaths: utilities_1.ifElse(project.usesPolaris, [path_1.join(polarisRoot, 'styles')])
                })
            }, utilities_2.sassGlobalsLoader(workspace)])
        });
    } else if (env.isClient && env.hasProductionAssets) {
        rules.push({
            test: /\.scss$/,
            exclude: /node_modules/,
            use: utilities_1.flatten([MiniCssExtractPlugin.loader, {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: path_1.join(paths.cache, 'webpack', `app-scss-${env.mode}-${env.target}`),
                    cacheIdentifier: `sewing-kit@${project.nodeModulesHash}`
                }
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap,
                    minimize: true,
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[hash:base64:5]'
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    config: utilities_1.ifElse(!project.hasPostCSSConfig, {
                        path: paths.defaultPostCSSConfig
                    }),
                    sourceMap
                }
            }, {
                loader: 'sass-loader',
                options: utilities_1.removeEmptyValues({
                    sourceMap,
                    includePaths: utilities_1.ifElse(project.usesPolaris, [path_1.join(polarisRoot, 'styles')])
                })
            }, utilities_2.sassGlobalsLoader(workspace)])
        });
    } else {
        rules.push({
            test: /\.scss$/,
            exclude: /node_modules/,
            use: ['happypack/loader?id=styles']
        });
    }
    return rules;
}
exports.sass = sass;
const SVG_ICONS_PATH_REGEX = /icons\/.*\.svg$/;
const IMAGE_PATH_REGEX = /\.(jpe?g|png|gif|svg)$/;
const ICO_PATH_REGEX = /\.ico$/;
function images({ env, paths, project }) {
    return utilities_1.flatten([{
        test(resource) {
            return SVG_ICONS_PATH_REGEX.test(resource);
        },
        use: utilities_1.flatten([{
            loader: 'cache-loader',
            options: {
                cacheDirectory: path_1.join(paths.cache, 'webpack', `svg-icons-${env.mode}`),
                cacheIdentifier: `sewing-kit@${project.nodeModulesHash}`
            }
        }, {
            loader: '@shopify/images/icon-loader'
        }, utilities_1.ifElse(env.hasProductionAssets, {
            loader: 'image-webpack-loader',
            options: {
                svgo: optimize_1.svgOptions()
            }
        })])
    }, {
        test: ICO_PATH_REGEX,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name]-[hash].[ext]'
            }
        }
    }, {
        test(resource) {
            return IMAGE_PATH_REGEX.test(resource) && !SVG_ICONS_PATH_REGEX.test(resource);
        },
        use: utilities_1.flatten([{
            loader: 'url-loader',
            options: {
                limit: 10000,
                emitFile: env.isClient
            }
        }, utilities_1.ifElse(env.hasProductionAssets, {
            loader: 'image-webpack-loader',
            options: {
                svgo: optimize_1.svgOptions()
            }
        })])
    }]);
}
exports.images = images;
function files() {
    return {
        test: /\.csv$/,
        loader: 'file-loader',
        options: {
            name: '[name]-[hash].[ext]'
        }
    };
}
exports.files = files;
function fonts() {
    return {
        test: /\.woff2$/,
        loader: 'url-loader',
        options: {
            limit: 50000,
            mimetype: 'application/font-woff',
            name: './fonts/[name].[ext]'
        }
    };
}
exports.fonts = fonts;
function babelOptionsForWorkspace(workspace) {
    const { env, project } = workspace;
    const { asyncChunks } = workspace.config.for('experiments');
    const plugins = [];
    if (env.isClient && env.hasProductionAssets && project.hasDependency('lodash')) {
        plugins.push('lodash');
    }
    if (asyncChunks) {
        plugins.push('@shopify/async-chunks/babel');
    }
    return {
        babelrc: false,
        forceEnv: env.hasProductionAssets ? 'production' : env.mode,
        presets: babelPresetForWorkspace(workspace),
        plugins
    };
}
function babelPresetForWorkspace(workspace) {
    const { env, project } = workspace;
    // To accommodate projects that have not/ cannot update past babel-preset-shopify@15,
    // always grab sewing-kit's version of `babel-preset-shopify`.
    const shopifyNode = require.resolve('babel-preset-shopify/node');
    const shopifyWeb = require.resolve('babel-preset-shopify/web');
    const shopifyReact = require.resolve('babel-preset-shopify/react');
    const presets = [];
    if (env.isServer) {
        presets.push([shopifyNode, { modules: false }]);
        if (project.usesReact) {
            presets.push(shopifyReact);
        }
        if (project.usesPreact) {
            presets.push([shopifyReact, { pragma: 'h' }]);
        }
    } else {
        presets.push([shopifyWeb, { modules: false }]);
        if (project.usesReact) {
            presets.push([shopifyReact, { hot: env.isDevelopment }]);
        }
        if (project.usesPreact) {
            presets.push([shopifyReact, { pragma: 'h' }]);
        }
    }
    return presets;
}
function javascript(workspace) {
    const { env, paths } = workspace;
    const { nodeModulesHash, usesPolaris } = workspace.project;
    const nodeObjectHash = require('node-object-hash');
    const options = babelOptionsForWorkspace(workspace);
    const optionsHash = nodeObjectHash().hash(options);
    return utilities_1.flatten([{
        test: /\.jsx?$/,
        exclude: [/node_modules/, paths.build],
        loader: 'babel-loader',
        options: Object.assign({}, options, { cacheDirectory: path_1.join(paths.cache, 'webpack', `babel-loader-${env.mode}-${env.target}`), cacheIdentifier: `${nodeModulesHash}-${optionsHash}` })
    }, utilities_1.ifElse(env.hasProductionAssets && usesPolaris, {
        test: /\.jsx?$/,
        include: /node_modules\/@shopify\/polaris\/esnext(\/|$)/,
        loader: 'babel-loader',
        options: Object.assign({}, options, {
            // Temporary workaround to prevent cyclical dependencies caused by hoisting in production mode (via `babel-plugin-transform-react-constant-elements`).
            // The associated unit test for this has a dissertation explaining this behaviour.
            forceEnv: 'lol', cacheDirectory: path_1.join(paths.cache, 'webpack', `babel-loader-polaris-${env.mode}-${env.target}`), cacheIdentifier: `${nodeModulesHash}-${optionsHash}` })
    })]);
}
exports.javascript = javascript;
function uncheckedTypescript(workspace, { sourceMaps = true } = {}) {
    const { env, paths, project } = workspace;
    if (!project.usesTypeScript) {
        return null;
    }
    const { nodeModulesHash } = workspace.project;
    const nodeObjectHash = require('node-object-hash');
    const options = babelOptionsForWorkspace(workspace);
    const optionsHash = nodeObjectHash().hash(options);
    return {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: Object.assign({}, options, { cacheDirectory: path_1.join(paths.cache, 'webpack', `ts-babel-loader-${env.mode}-${env.target}`), cacheIdentifier: `${nodeModulesHash}-${optionsHash}` })
        }, {
            loader: 'cache-loader',
            options: {
                cacheDirectory: path_1.join(paths.cache, 'webpack', `ts-loader-${env.mode}`, `${project.nodeModulesHash}`),
                cacheIdentifier: `sewing-kit@${project.nodeModulesHash}`
            }
        }, {
            loader: 'ts-loader',
            options: {
                happyPackMode: true,
                silent: true,
                transpileOnly: true,
                compilerOptions: {
                    noEmit: false,
                    skipLibCheck: true,
                    skipDefaultLibCheck: true,
                    strict: false,
                    strictFunctionTypes: false,
                    strictNullChecks: false,
                    sourceMap: sourceMaps
                }
            }
        }]
    };
}
exports.uncheckedTypescript = uncheckedTypescript;
function checkedTypescript(workspace) {
    const { env, paths, project } = workspace;
    if (!project.usesTypeScript) {
        return null;
    }
    const { nodeModulesHash } = workspace.project;
    const nodeObjectHash = require('node-object-hash');
    const babelOptions = babelOptionsForWorkspace(workspace);
    const babelOptionsHash = nodeObjectHash().hash(babelOptions);
    return {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: Object.assign({}, babelOptionsForWorkspace(workspace), { cacheDirectory: path_1.join(paths.cache, 'webpack', `ts-babel-loader-${env.mode}-${env.target}`), cacheIdentifier: `${nodeModulesHash}-${babelOptionsHash}` })
        }, {
            loader: 'awesome-typescript-loader',
            options: {
                silent: true,
                useBabel: false,
                useCache: true,
                transpileOnly: false,
                compiler: path_1.join(paths.nodeModules, 'typescript'),
                cacheDirectory: path_1.join(paths.cache, 'webpack', `at-loader-${env.mode}`, `${project.nodeModulesHash}`)
            }
        }]
    };
}
exports.checkedTypescript = checkedTypescript;
function graphql({ config, paths, project }) {
    const usesGraphQL = Boolean(config.for('graphql'));
    if (!usesGraphQL) {
        return null;
    }
    return {
        test: /\.graphql$/,
        use: [{
            loader: 'cache-loader',
            options: {
                cacheDirectory: path_1.join(paths.cache, 'webpack', 'graphql'),
                cacheIdentifier: `sewing-kit@${project.nodeModulesHash}`
            }
        }, { loader: 'graphql-tag/loader' }]
    };
}
exports.graphql = graphql;
function focus({ paths }, { sections }) {
    return {
        test(file) {
            if (!file.startsWith(paths.sections)) {
                return false;
            }
            const parts = path_1.relative(paths.sections, file).split(path_1.sep);
            // Products/index.ts should be handled normally,
            // Products/ProductIndex/index.ts should be omitted by this plugin
            if (parts.length < 3) {
                return false;
            }
            return !sections.includes(parts[0]);
        },
        use: [{
            loader: require.resolve("../../../../../lib/packages/webpack-section-focus-loader"),
            options: {
                focus: sections
            }
        }]
    };
}
exports.focus = focus;
function withoutTypescript() {
    return {
        test: /\.tsx?$/,
        use: [{
            loader: require.resolve("../../../../../lib/packages/webpack-no-typescript-ts-loader")
        }]
    };
}
exports.withoutTypescript = withoutTypescript;
function withoutReact({ root }) {
    return {
        test: /\.(jsx|tsx)$/,
        use: [{
            loader: require.resolve("../../../../../lib/packages/webpack-no-react-jsx-loader"),
            options: {
                root
            }
        }]
    };
}
exports.withoutReact = withoutReact;