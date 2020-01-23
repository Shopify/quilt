import {dirname, join, relative, resolve} from 'path';

import {readFileSync, readJSONSync} from 'fs-extra';
import glob from 'glob';

const KNOWN_TEMPLATE_KEYS = [
  'author',
  'bugs',
  'dependencies',
  'description',
  'files',
  'homepage',
  'license',
  'main',
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

packages.forEach(
  ({packageName, packageJSONPath, packageJSON, expectedPackageJSON}) => {
    // eslint-disable-next-line jest/valid-describe
    describe(packageJSONPath, () => {
      it('specifies Shopify as author', () => {
        expect(packageJSON.author).toBe(expectedPackageJSON.author);
      });

      it('specifies Quilt Issues as bugs URL', () => {
        expect(packageJSON.bugs).toStrictEqual(expectedPackageJSON.bugs);
      });

      it('specifies dependencies', () => {
        expect(packageJSON.dependencies).not.toStrictEqual({});
      });

      it('specifies a description', () => {
        expect(packageJSON.description).not.toBeUndefined();
      });

      it('specifies publishable files', () => {
        expect(packageJSON.files).toStrictEqual(
          expect.arrayContaining(expectedPackageJSON.files),
        );
      });

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

      it('specifies scripts, including build', () => {
        expect(packageJSON.scripts.build).toBe(
          expectedPackageJSON.scripts.build,
        );
      });

      it('specifies if webpack can tree-shake, via sideEffects', () => {
        expect(packageJSON.sideEffects).toBe(Boolean(packageJSON.sideEffects));
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
  },
);

function readPackages() {
  const packagesPath = join(ROOT_PATH, 'packages');

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
  return JSON.parse(rawPackageJSONTemplate.replace(/{{name}}/g, name));
}
