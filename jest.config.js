const {readdirSync, existsSync} = require('fs');
const path = require('path');

const moduleNameMapper = getPackageNames().reduce(
  (accumulator, name) => {
    const scopedName = `@shopify/${name}$`;
    accumulator[scopedName] = `<rootDir>/packages/${name}/src/index.ts`;
    return accumulator;
  },
  {
    '@shopify/react-effect/server':
      '<rootDir>/packages/react-effect/src/server.tsx',
    '@shopify/react-async/testing':
      '<rootDir>/packages/react-async/src/testing.tsx',
    '@shopify/react-html/server':
      '<rootDir>/packages/react-html/src/server/index.ts',
    '@shopify/react-network/server':
      '<rootDir>/packages/react-network/src/server.ts',
  },
);

module.exports = {
  setupFiles: ['./test/setup.ts'],
  setupFilesAfterEnv: ['./test/each-test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
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
