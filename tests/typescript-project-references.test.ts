import {resolve} from 'path';
import {readFileSync} from 'fs';

import glob from 'glob';
import {readJSONSync} from 'fs-extra';

import {shouldSkipShopifyPrefix} from './skip-shopify-prefix';
import {EXCLUDED_PACKAGES} from './utilities';

const ROOT = resolve(__dirname, '..');
const basePackagePath = resolve(ROOT, 'packages');
const projectReferencesConfig = resolve(ROOT, 'tsconfig.json');

describe('typescript project references', () => {
  const referencesConfig = readJSONSync(projectReferencesConfig);
  const references = referencesConfig.references.map(({path}) =>
    path.replace('./packages/', ''),
  );
  const quiltReferences = references.map(prefixPackageName);

  it('includes all the packages', () => {
    const packageNameRegex = new RegExp(
      `${basePackagePath}/(?<packageName>[\\w._-]+)/package\\.json$`,
      'i',
    );
    const packages = glob
      .sync(resolve(basePackagePath, '*/package.json'))
      .map(
        (packageJsonPath) =>
          packageJsonPath.match(packageNameRegex).groups.packageName,
      )
      .filter((packageName) => !EXCLUDED_PACKAGES.includes(packageName));

    expect(packages.sort()).toStrictEqual(references.sort());
  });

  references.map((packageName) => {
    const displayedName = prefixPackageName(packageName);

    describe(`${displayedName}`, () => {
      it(`includes internal packages used as references`, () => {
        const packageJson = resolvePackageJSONFile(packageName, 'package.json');
        const tsconfigJson = resolvePackageJSONFile(
          packageName,
          'tsconfig.json',
        );
        /* eslint-disable-next-line jest/no-conditional-in-test */
        const internalReferences = tsconfigJson.references || [];

        const internalPackages = internalReferences
          .map((internalReference) =>
            extractPackagesFromInternalReference(internalReference),
          )
          .sort();

        const dependencies = Object.keys({
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.peerDependencies,
        });

        const quiltPackage = dependencies
          .filter((lib) => quiltReferences.includes(lib))
          .sort();

        expect(internalPackages).toStrictEqual(quiltPackage);
      });
    });
  });
});

function prefixPackageName(packageName: string) {
  const skipPrefix = shouldSkipShopifyPrefix(packageName);
  if (skipPrefix) {
    return packageName;
  }

  return `@shopify/${packageName}`;
}

function resolvePackageJSONFile(packageName: string, file: string) {
  const path = glob.sync(resolve(basePackagePath, packageName, file))[0];
  return readJSONSync(path);
}

const internalReferenceRegex = /\.\.\/(?<packageName>[\w._-]+)/i;
function extractPackagesFromInternalReference(internalReference: {
  path: string;
}) {
  return prefixPackageName(
    internalReferenceRegex.exec(internalReference.path).groups.packageName,
  );
}
