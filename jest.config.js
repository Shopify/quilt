const {readdirSync, existsSync} = require('fs');
const path = require('path');

const moduleNameMapper = getPackageNames().reduce(
  (accumulator, name) => {
    const scopedName = `@shopify/${name}`;
    accumulator[scopedName] = `<rootDir>/packages/${name}/src/index.ts`;
    return accumulator;
  },
  {
    '@shopify/react-effect/server':
      '<rootDir>/packages/react-effect/src/server.tsx',
  },
);

module.exports = {
  setupFiles: ['./test/setup.ts'],
  setupTestFrameworkScriptFile: './test/each-test.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  testRegex: '.*\\.test\\.tsx?$',
  testEnvironmentOptions: {
    url: 'http://localhost:3000/',
  },
  coverageDirectory: './coverage/',
  collectCoverage: true,
  moduleNameMapper,
};

function getPackageNames() {
  const packagesPath = path.join(__dirname, 'packages');
  return readdirSync(packagesPath).filter(packageName => {
    const packageJSONPath = path.join(
      packagesPath,
      packageName,
      'package.json',
    );
    return existsSync(packageJSONPath);
  });
}
