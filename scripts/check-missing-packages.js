const path = require('path');
const {readdirSync} = require('fs-extra');
const grep = require('simple-grep');
const uniq = require('lodash/uniq');

const packagesPath = path.resolve(__dirname, '..', 'packages');
const packageNames = readdirSync(packagesPath).filter(
  file => !file.includes('.'),
);

packageNames.forEach(checkDependencies);

function checkDependencies(package) {
  const packageJson = path.resolve(packagesPath, package, 'package.json');
  let pkg;

  try {
    pkg = require(packageJson);
  } catch (error) {
    // swallow error
  }

  if (!pkg) {
    return;
  }

  const {dependencies = {}, devDependencies = {}, peerDependencies = {}} = pkg;
  const allDependencies = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
    ...Object.keys(peerDependencies),
  ];
  const missingDependencies = [];

  grep(`@shopify/`, path.resolve(packagesPath, package), function(list) {
    list.forEach(item => {
      if (path.extname(item.file) !== '.ts') {
        return;
      }

      item.results.forEach(({line}) => {
        const parts = line.split('from');

        if (parts.length !== 2) {
          return;
        }

        const imported = parts[parts.length - 1]
          .replace(/'/g, '')
          .replace(/;/, '')
          .trim();

        if (!allDependencies.includes(imported)) {
          missingDependencies.push(imported);
        }
      });
    });

    if (missingDependencies.length > 1) {
      console.warn(
        `Missing Dependencies found in ${package}. You must include ${uniq(
          missingDependencies,
        ).join(', ')} in the package.json for this package.`,
      );
    }
  });
}
