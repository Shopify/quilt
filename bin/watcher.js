/* eslint-disable no-console */
const fs = require('fs-extra');
const {join, basename} = require('path');

function isCompiling(dataStr) {
  return dataStr.match(
    /File change detected. Starting incremental compilation/,
  );
}

function isCompileFinished(dataStr) {
  return dataStr.match(/Found 0 errors. Watching for file changes/);
}

module.exports = function watcher(
  sourcePackageDirectory,
  destinationPackageDirectory,
) {
  console.log(
    `👍  Changes will be synced to ${destinationPackageDirectory} for local 🎩`,
  );

  const source = {
    root: sourcePackageDirectory,
    dist: join(sourcePackageDirectory, 'dist'),
    dependencies: join(sourcePackageDirectory, 'node_modules'),
  };

  const destination = {
    root: destinationPackageDirectory,
    dist: join(destinationPackageDirectory, 'dist'),
    dependencies: join(destinationPackageDirectory, 'node_modules'),
  };

  const {exec, spawn} = require('child_process');

  console.log('🛠  Initial compile...');
  const packageName = basename(sourcePackageDirectory);
  const child = exec(
    `./node_modules/.bin/lerna run build --stream --scope=@shopify/${packageName} -- --watch`,
  );

  let compileId = 0;
  let nextUpdate = createUpdateTask(++compileId);

  child.stdout.on('data', data => {
    const dataStr = data.toString();
    if (isCompiling(dataStr)) {
      console.log('🛠  Recompiling');
      nextUpdate = createUpdateTask(++compileId);
    } else if (isCompileFinished(dataStr)) {
      nextUpdate();
    } else {
      console.log(`${data}`);
    }
  });

  function createUpdateTask(thisCompileId) {
    return function() {
      if (thisCompileId !== compileId) {
        return;
      }

      console.log(`  👷🏼‍♂️  Updating paths`);

      if (thisCompileId !== compileId) {
        return;
      }

      if (destination) {
        console.log(`  📠  Copying to ${destination.root}`);
        Promise.all([
          fs.copy(source.dist, destination.dist),
          fs.copy(source.dependencies, destination.dependencies),
        ])
          .then(() => {
            if (thisCompileId === compileId) {
              console.log('  🎩  ready');
            }
            return null;
          })
          .catch(error => {
            console.error(`Error ${error}`);
          });
      }
    };
  }

  child.on('close', code => {
    process.stdout.write('closed\n', code);
  });

  child.on('error', err => {
    process.stderr.write('error\n', err);
  });

  child.stderr.on('data', data => {
    process.stderr.write(`${data}\n`);
  });

  child.stderr.on('error', err => {
    process.stderr.write('error\n', err);
  });
};
