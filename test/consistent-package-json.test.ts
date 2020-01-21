import {dirname, join, relative, resolve} from 'path';

import {readFileSync, readJSONSync} from 'fs-extra';
import glob from 'glob';

const ROOT_PATH = resolve(__dirname, '..');
const rawPackageJSONTemplate = readFileSync(
  join(ROOT_PATH, 'templates', 'package.hbs.json'),
  {encoding: 'utf8'},
);

const packages = readPackages();

packages.forEach(
  ({packageName, packageJSONPath, packageJSON, expectedPackageJSON}) => {
    // eslint-disable-next-line jest/valid-describe
    describe(packageJSONPath, () => {
      it('specifies name matching scope and path', () => {
        expect(packageJSON.name).toBe(expectedPackageJSON.name);
      });
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
