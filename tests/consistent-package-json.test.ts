import {dirname, join, relative, resolve} from 'path';

import {readFileSync, readJSONSync} from 'fs-extra';
import glob from 'glob';

import {shouldSkipShopifyPrefix} from './skip-shopify-prefix';

const KNOWN_TEMPLATE_KEYS = [
  'author',
  'bugs',
  'dependencies',
  'description',
  'esnext',
  'exports',
  'files',
  'homepage',
  'license',
  'main',
  'module',
  'name',
  'publishConfig',
  'repository',
  'scripts',
  'sideEffects',
  'types',
  'version',
];

const SINGLE_ENTRYPOINT_EXCEPTIONS = ['graphql-persisted'];

const ROOT_PATH = resolve(__dirname, '..');
const packagesPath = join(ROOT_PATH, 'packages');
const rawPackageJSONTemplate = readFileSync(
  join(ROOT_PATH, 'templates', 'package.hbs.json'),
  {encoding: 'utf8'},
);

const packages = readPackages();

describe('templates/package.hbs.json', () => {
  it('has only known keys', () => {
    const keys = Object.keys(JSON.parse(rawPackageJSONTemplate)).sort();

    // Template keys should match exactly. If updating it, remember to update tests!
    expect(keys).toStrictEqual(KNOWN_TEMPLATE_KEYS);
  });
});

const IGNORE_PACKAGES = ['@types/'];

packages.forEach(
  ({packageName, packageJSONPath, packageJSON, expectedPackageJSON}) => {
    describe(`${packageName}`, () => {
      // eslint-disable-next-line jest/valid-title
      describe(packageJSONPath, () => {
        it('specifies Shopify as author', () => {
          expect(packageJSON.author).toBe(expectedPackageJSON.author);
        });
        it('specifies Quilt Issues as bugs URL', () => {
          expect(packageJSON.bugs).toStrictEqual(expectedPackageJSON.bugs);
        });
        it('specifies a description', () => {
          expect(packageJSON.description).not.toBeUndefined();
        });
        if (SINGLE_ENTRYPOINT_EXCEPTIONS.includes(packageName)) {
          it('specifies publishable files, including at least one entrypoint', () => {
            expect(packageJSON.files).toStrictEqual(
              expect.arrayContaining(['build/*', '!*.tsbuildinfo']),
            );
            expect(packageJSON.files.length).toBeGreaterThan(2);
          });
        } else {
          it('specifies publishable files, including index entrypoints', () => {
            // Don't use arrayContaining here as it does not guarantee order
            // We want to make sure the first set of items are always in a fixed
            // order. Most importantly, the `!*.tsbuildinfo` exclusion must be
            // after `build/*`.
            /* eslint-disable jest/no-if */
            if (packageJSON?.bin) {
              expectedPackageJSON.files.unshift('bin/*');
            }
            /* eslint-enable */
            expect(
              packageJSON.files.slice(0, expectedPackageJSON.files.length),
            ).toStrictEqual(expectedPackageJSON.files);
          });
        }
        it('specifies Quilt deep-link homepage', () => {
          expect(packageJSON.homepage).toBe(expectedPackageJSON.homepage);
        });
        it('specifies the MIT license', () => {
          expect(packageJSON.license).toBe(expectedPackageJSON.license);
        });
        it('specifies name matching scope and path', () => {
          expect(packageJSON.name).toBe(expectedPackageJSON.name);
        });
        it('specifies Shopify‘s public publishConfig', () => {
          expect(packageJSON.publishConfig).toStrictEqual(
            expectedPackageJSON.publishConfig,
          );
        });
        it('specifies a repository deep-linking into the Quilt monorepo', () => {
          expect(packageJSON.repository).toStrictEqual(
            expectedPackageJSON.repository,
          );
        });
        it('specifies if webpack can tree-shake, via sideEffects', () => {
          expect(packageJSON.sideEffects).toBe(
            Boolean(packageJSON.sideEffects),
          );
        });
        if (!SINGLE_ENTRYPOINT_EXCEPTIONS.includes(packageName)) {
          it('specifies the expected main', () => {
            expect(packageJSON.main).toBe(expectedPackageJSON.main);
          });
          it('specifies the expected types', () => {
            expect(packageJSON.types).toBe(expectedPackageJSON.types);
          });
        }
      });

      it(`ensures packages included in dependencies are used`, () => {
        const dependencies = Object.keys({
          ...packageJSON.dependencies,
        }).filter(dep =>
          IGNORE_PACKAGES.every(ignorePackage => !dep.includes(ignorePackage)),
        );

        const filesContent = glob
          .sync(resolve(packagesPath, packageName, '**/*.ts*'))
          .filter(path => !path.includes('/dist/'))
          .map(path => readFileSync(path, 'utf8'));

        const expectValue = dependencies.filter(dep =>
          filesContent.some(content => content.includes(dep)),
        );

        expect(dependencies).toStrictEqual(expectValue);
      });
    });
  },
);

function readPackages() {
  return glob
    .sync(join(packagesPath, '*', 'package.json'))
    .map(absolutePackageJSONPath => {
      const packageName = dirname(
        relative(packagesPath, absolutePackageJSONPath),
      );
      const packageJSONPath = relative(ROOT_PATH, absolutePackageJSONPath);
      const packageJSON = readJSONSync(absolutePackageJSONPath);
      const expectedPackageJSON = compileTemplate({name: packageName});

      return {packageName, packageJSONPath, packageJSON, expectedPackageJSON};
    });
}

function compileTemplate({name}) {
  const skipPrefix = shouldSkipShopifyPrefix(name);

  if (skipPrefix) {
    return JSON.parse(
      rawPackageJSONTemplate
        .replace(/@shopify\/{{name}}/g, name)
        .replace(/{{name}}/g, name),
    );
  }

  return JSON.parse(rawPackageJSONTemplate.replace(/{{name}}/g, name));
}
