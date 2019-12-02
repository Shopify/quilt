const {execSync} = require('child_process');

const fs = require('fs-extra');

async function run() {
  // TODO: bail if we're on master
  // TRAVIS_PULL_REQUEST_BRANCH

  await fs.mkdirp('./tsbuildcache');

  if (await fs.pathExists('./tsbuildcache/cache.tar')) {
    execSync('tar -xf ./tsbuildcache/cache.tar');
  }

  resetModifiedDates();
  touchModifiedFiles(findBranchChanges());
}

run();

function resetModifiedDates() {
  const touch = 'touch -m -t 201001010000';
  execSync(`${touch} ./packages/tsconfig_base.json`);
  execSync(`find ./packages/*/tsconfig.json -exec ${touch} {} +`);
  execSync(`find ./packages/*/src -exec ${touch} {} +`);
  execSync(`find ./config -exec ${touch} {} +`);
}

function findBranchChanges() {
  // Inspired by:
  // - https://stackoverflow.com/a/50521039
  // - https://stackoverflow.com/a/4991675
  return execSync(
    'git --no-pager diff  --name-only --diff-filter=AM $(git rev-list --first-parent origin/master | head -1) HEAD',
  )
    .toString()
    .trim()
    .split('\n');
}

function touchModifiedSrcFiles(files) {
  files.forEach(file => {
    console.log(file);
    execSync(`touch ${file}`);
  });
}
