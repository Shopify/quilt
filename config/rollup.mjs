import path from 'path';
import {fileURLToPath} from 'url';

import {babel} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals';

/** @typedef {import('rollup').RollupOptions} RollupOptions */

export function buildConfig(
  rollupConfigFileUrl,
  {
    entries = [],
    binaries = [],
    entrypoints = {},
    commonjs = true,
    esmodules = true,
    esnext = true,
    isIsomorphic = true,
  },
) {
  const cwd = fileURLToPath(new URL('.', rollupConfigFileUrl));
  const input = [...entries, ...binaries].map((filePath) =>
    path.resolve(cwd, filePath),
  );

  const browserslistEnv = isIsomorphic ? 'production' : 'server-only';

  const configs = [];

  const packageJsonPath = path.resolve(cwd, './package.json');

  if (commonjs || esmodules) {
    configs.push({
      input,
      plugins: buildPlugins({browserslistEnv, packageJsonPath}),
      output: buildOutputs({
        commonjs: path.resolve(cwd, 'build/cjs'),
        esmodules: path.resolve(cwd, 'build/esm'),
      }),
    });
  }

  if (esnext) {
    configs.push({
      input,
      plugins: buildPlugins({browserslistEnv: 'esnext', packageJsonPath}),
      output: buildOutputs({esnext: path.resolve(cwd, 'build/esnext')}),
    });
  }

  const entriesMapping = Object.entries(entrypoints).reduce(
    (memo, [name, root]) => {
      memo[`${name ?? 'index'}.js`] = path.resolve(cwd, root);
      return memo;
    },
    {},
  );
  const entriesInput = Object.keys(entriesMapping);
  if (entriesInput) {
    configs.push({
      input: entriesInput,
      plugins: [
        babel({
          rootMode: 'upward',
          // Options specific to @rollup/plugin-babel, these can not be
          // present on the `babelConfig` object
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          exclude: 'node_modules/**',
          babelHelpers: 'inline',
          // Options that may be present on the `babelConfig` object but
          // we want to override
          envName: 'production',
          // @ts-expect-error browserslistEnv is a valid babel option but @types/babel__core doesn't know that yet
          browserslistEnv,
        }),

        entrypointsPlugin(entriesMapping),
      ],
      output: buildEntrypointOutputs(cwd, {
        commonjs,
        esmodules,
        esnext,
      }),
    });
  }

  return configs;
}

function buildPlugins({packageJsonPath, browserslistEnv}) {
  return [
    externals({deps: true, packagePath: packageJsonPath}),
    nodeResolve({extensions: ['.js', '.jsx', '.ts', '.tsx']}),
    commonjs(),
    babel({
      rootMode: 'upward',
      // Options specific to @rollup/plugin-babel, these can not be
      // present on the `babelConfig` object
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      // Options that may be present on the `babelConfig` object but
      // we want to override
      envName: 'production',
      // @ts-expect-error browserslistEnv is a valid babel option but @types/babel__core doesn't know that yet
      browserslistEnv,
    }),
  ];
}

function buildOutputs({commonjs = '', esmodules = '', esnext = ''}) {
  /** @type {RollupOptions} */
  const outputs = [];

  if (commonjs) {
    outputs.push({
      format: 'cjs',
      dir: commonjs,
      preserveModules: true,
      entryFileNames: '[name][assetExtname].js',
      exports: 'named',
    });
  }

  if (esmodules) {
    outputs.push({
      format: 'esm',
      dir: esmodules,
      preserveModules: true,
      entryFileNames: '[name][assetExtname].mjs',
    });
  }

  if (esnext) {
    outputs.push({
      format: 'esm',
      dir: esnext,
      preserveModules: true,
      entryFileNames: '[name][assetExtname].esnext',
    });
  }

  return outputs;
}

function buildEntrypointOutputs(
  dir,
  {commonjs = false, esmodules = false, esnext = false},
) {
  /** @type {RollupOptions} */
  const outputs = [];

  if (commonjs) {
    outputs.push({
      format: 'cjs',
      dir,
      entryFileNames: '[name].js',
      exports: 'named',
    });
  }

  if (esmodules) {
    outputs.push({format: 'esm', dir, entryFileNames: '[name].mjs'});
  }

  if (esnext) {
    outputs.push({format: 'esm', dir, entryFileNames: '[name].esnext'});
  }

  return outputs;
}

/**
 * @param {{[key: string]: string}} entriesMapping
 */
function entrypointsPlugin(entriesMapping) {
  const commonEntryRoot = findCommonAncestorPath(
    ...Object.values(entriesMapping).map((entryFilename) =>
      path.dirname(entryFilename),
    ),
  );

  const entriesMappingReverseLookup = Object.fromEntries(
    Object.entries(entriesMapping).map(([name, root]) => [root, name]),
  );

  return {
    name: 'entrypoints',

    resolveId(id, _importer, options) {
      return {
        id: entriesMapping[id] ? entriesMapping[id] : id,
        external: !options.isEntry,
      };
    },

    renderChunk(code, chunk, outputOptions) {
      if (
        !chunk.isEntry ||
        !entriesMappingReverseLookup[chunk.facadeModuleId]
      ) {
        throw new Error(
          `Generating chunk for unexpected file: "${chunk.fileName}"`,
        );
      }

      const entrypointFilename =
        path.basename(
          entriesMappingReverseLookup[chunk.facadeModuleId],
          path.extname(entriesMappingReverseLookup[chunk.facadeModuleId]),
        ) + path.extname(chunk.fileName);

      const entrypointImportPath = path
        .relative(commonEntryRoot, chunk.facadeModuleId)
        .replace(/\.[^.]+$/, path.extname(chunk.fileName));

      chunk.fileName = entrypointFilename;

      if (chunk.fileName.endsWith('.js')) {
        return cjsEntrypointContent(
          JSON.stringify(`./build/cjs/${entrypointImportPath}`),
        );
      }

      if (chunk.fileName.endsWith('.mjs')) {
        return esmEntrypointContent(
          JSON.stringify(`./build/esm/${entrypointImportPath}`),
          chunk.exports.includes('default'),
        );
      }

      if (chunk.fileName.endsWith('.esnext')) {
        return esmEntrypointContent(
          JSON.stringify(`./build/esnext/${entrypointImportPath}`),
          chunk.exports.includes('default'),
        );
      }

      throw new Error(
        `Generating chunk for unexpected file: "${chunk.fileName}"`,
      );
    },
  };
}

/**
 * @param {string} quotedPath
 */
function cjsEntrypointContent(quotedPath) {
  return `module.exports = require(${quotedPath});`;
}

/**
 * @param {string} quotedPath
 * @param {boolean} hasDefault
 */
function esmEntrypointContent(quotedPath, hasDefault) {
  return [
    `export * from ${quotedPath};`,
    hasDefault ? `export {default} from ${quotedPath};` : false,
  ]
    .filter(Boolean)
    .join('\n');
}

/* eslint-disable id-length, no-nested-ternary, no-negated-condition */
function* commonArrayMembers(a, b) {
  const [longest, shortest] = a.length > b.length ? [a, b] : [b, a];
  for (const x of shortest) {
    if (x === longest.shift()) yield x;
    else break;
  }
}
function findCommonAncestorPath(...paths) {
  return paths.reduce((a, b) =>
    a === b
      ? a
      : path.parse(a).root !== path.parse(b).root
        ? null
        : [
            ...commonArrayMembers(
              path.normalize(a).split(path.sep),
              path.normalize(b).split(path.sep),
            ),
          ].join(path.sep),
  );
}
/* eslint-enable */
