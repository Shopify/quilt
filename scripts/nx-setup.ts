import {resolve, basename, dirname} from 'node:path';
import {readFileSync, existsSync} from 'node:fs';
import * as glob from 'glob';
import {writeFileSync} from 'fs-extra';

const root = resolve(__dirname + '/..');

const jestConfigTemplate = readFileSync(
  './scripts/templates/nx-jest-config.template',
  'utf8',
);
const nxProjectTemplate = readFileSync(
  './scripts/templates/nx-project-template.template',
  'utf8',
);

const eslintIgnoreTemplate = readFileSync(
  './scripts/templates/eslintignore.template',
  'utf8',
);
const eslintRcTemplate = readFileSync(
  './scripts/templates/eslintrc.template',
  'utf8',
);
const tsconfigEslintTemplate = readFileSync(
  './scripts/templates/tsconfig-eslint.template',
  'utf8',
);

const packageMapping = glob
  .sync('./packages/*/package.json', {cwd: root})
  .map((fn) => {
    const dirName = basename(dirname(fn));
    const packageJson = JSON.parse(readFileSync(fn, 'utf8'));

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

const main = () => {
  console.log('Generating NX configurations...');
  let totalJest = 0;
  let totalNx = 0;
  packageMapping.map(({name, packageName}) => {
    let jestConfig = jestConfigTemplate;
    jestConfig = jestConfig.replace(/{{packageName}}/g, packageName);
    console.log('jestConfig', jestConfig);
    writeFileSync(`./packages/${name}/jest.config.js`, jestConfig);
    totalJest++;
    let nxProject = nxProjectTemplate;
    nxProject = nxProject
      .replace(/{{packageName}}/g, packageName)
      .replace(/{{name}}/g, name);
    writeFileSync(`./packages/${name}/project.json`, nxProject);
    totalNx++;
  });

  console.log('Done Generating NX configurations...');
  console.log(`Total Jest configurations generated: ${totalJest}`);
  console.log(`Total NX configurations generated: ${totalNx}`);

  console.log('Generating Eslint configurations...');
  let totalEslint = 0;
  packageMapping.map(({name, packageName}) => {
    let eslintRc = eslintRcTemplate;
    writeFileSync(`./packages/${name}/.eslintrc.json`, eslintRc);
    let eslintIgnore = eslintIgnoreTemplate;
    writeFileSync(`./packages/${name}/.eslintignore`, eslintIgnore);
    let tsconfigEslint = tsconfigEslintTemplate;
    writeFileSync(`./packages/${name}/tsconfig.eslint.json`, tsconfigEslint);
    totalEslint++;
  });

  console.log('Done Generating Eslint configurations...');
  console.log(`Total Eslint configurations generated: ${totalEslint}`);
};

main();
