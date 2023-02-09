const path = require('path');
const fs = require('fs');
const glob = require('glob');

const root = __dirname;

/** Optional value that can be provided to override the version of React used in tests */
// eslint-disable-next-line no-process-env
const REACT_VERSION = process.env.REACT_VERSION ?? '';

const packageMapping = glob
  .sync('./packages/*/package.json', {cwd: root})
  .map((fn) => {
    const packageJson = JSON.parse(fs.readFileSync(fn, 'utf8'));

    return {
      name: path.basename(path.dirname(fn)),
      packageName: packageJson.name,
    };
  });

const moduleNameMapper = {
  ...packageMapping.reduce((memo, {name, packageName}) => {
    memo[`^${packageName}((/.*)?)$`] = `${root}/packages/${name}/src$1`;
    return memo;
  }, {}),
  '^react-dom((/.*)?)$': `react-dom${REACT_VERSION}$1`,
  '^react((/.*)?)$': `react${REACT_VERSION}$1`,
};

const configOverrides = {
  polyfills: {
    transform: {
      '^.+\\.(m?js|tsx?)$': [
        `babel-jest`,
        {
          presets: [
            [
              '@shopify/babel-preset',
              {
                typescript: true,
                react: true,
                useBuiltIns: false,
                corejs: false,
              },
            ],
          ],
          targets: 'current node',
          envName: 'test',
        },
      ],
    },
  },
  'storybook-a11y-test': {
    testEnvironment: 'node',
  },
  'react-testing': {
    setupFiles: [
      `${root}/tests/setup/environment.ts`,
      `${root}/packages/react-testing/src/tests/setup/environment.ts`,
    ],
  },
};

function project(packageName, overrideOptions = {}) {
  return {
    rootDir: `packages/${packageName}`,
    displayName: packageName,
    testRegex: ['.+\\.test\\.(js|mjs|ts|tsx|json)$'],
    moduleFileExtensions: ['js', 'mjs', 'ts', 'tsx', 'json'],
    moduleNameMapper,
    setupFiles: [`${root}/tests/setup/environment.ts`],
    setupFilesAfterEnv: [`${root}/tests/setup/tests.ts`],
    transform: {
      '^.+\\.(m?js|tsx?)$': [
        `babel-jest`,
        {
          presets: [['@shopify/babel-preset', {typescript: true, react: true}]],
          targets: 'current node',
          envName: 'test',
        },
      ],
    },
    testEnvironment: 'jsdom',
    testRunner: 'jest-circus',
    watchPathIgnorePatterns: [
      '<rootDir>/(build|node_modules)',
      '<rootDir>/.*/tests?/.*fixtures',
    ],
    ...overrideOptions,
  };
}

module.exports = {
  cacheDirectory: `${root}/.loom/cache/jest`,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  projects: [
    // Root is a special case - the top level tests folder
    project('root', {rootDir: 'tests'}),

    // Everything else is the `packages/*` folders
    ...packageMapping.map(({name}) => project(name, configOverrides[name])),

    // tsd type assertions using jest-runner-tsd
    project('useful-types', {
      displayName: {name: 'useful-types', color: 'blue'},
      runner: 'jest-runner-tsd',
      testRegex: ['.+\\.test-d\\.(ts|tsx)$'],
    }),
  ],
};
