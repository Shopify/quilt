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
    const dirName = path.basename(path.dirname(fn));
    const packageJson = JSON.parse(fs.readFileSync(fn, 'utf8'));

    const nameParts = packageJson.name.split('/', 2);
    if (nameParts.length == 1) {
      nameParts.unshift('');
    }

    if (dirName !== nameParts[1]) {
      throw new Error(
        `Directory name and package name without the namespace should match. Non-matching pair found: Directory "packages/${dirName}" has packageName ${packageJson.name}`,
      );
    }

    return {
      name: dirName,
      packageName: packageJson.name,
      packageNameParts: nameParts,
    };
  });

// Kinda complicated, but needed because not all packages are in the `@shopify`
// namespace.
const moduleNameMapperForPackages = Object.entries(
  packageMapping.reduce((memo, packageInfo) => {
    const [namespace, nameWithoutNamespace] = packageInfo.packageNameParts;

    if (!memo[namespace]) {
      memo[namespace] = [];
    }
    memo[namespace].push(nameWithoutNamespace);
    return memo;
  }, {}),
).reduce((memo, [namespace, packages]) => {
  const match = `${namespace ? namespace + '/' : ''}(${packages.join('|')})`;
  memo[`^${match}((/.*)?)$`] = `${root}/packages/$1/src$2`;
  return memo;
}, {});

const moduleNameMapper = {
  ...moduleNameMapperForPackages,
  '^react-dom((/.*)?)$': `react-dom${REACT_VERSION}$1`,
  '^react((/.*)?)$': `react${REACT_VERSION}$1`,
};

const configOverrides = {
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
        {rootMode: 'upward', targets: 'current node', envName: 'test'},
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

function typesProject(packageName, overrideOptions = {}) {
  return project(packageName, {
    displayName: {name: packageName, color: 'blue'},
    runner: 'jest-runner-tsd',
    testRegex: ['.+\\.test-d\\.(ts|tsx)$'],
    ...overrideOptions,
  });
}

module.exports = {
  cacheDirectory: `${root}/.cache/jest`,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  projects: [
    // Root is a special case - the top level tests folder
    project('root', {rootDir: 'tests'}),

    // Everything else is the `packages/*` folders
    ...packageMapping.flatMap(({name}) => [
      project(name, configOverrides[name]),
      typesProject(name, configOverrides[name]),
    ]),
  ],
};
