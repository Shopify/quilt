const {execSync} = require('child_process');
const fs = require('fs-extra');

const {exec, gracefulExit} = require('./utilities');

process.on('uncaughtException', gracefulExit);
process.on('unhandledRejection', gracefulExit);

const resetModifiedTimesCommand = 'touch -m -t 201001010000';

/*
 * This script is an ugly hack to speed up CI time :/  It is necessary because:
 * - TypeScript's incremental build caching is based on file modification dates
 * - Git always clones repos using the current date/time for all files
 * - So in CI, TypeScript will always view a cache as 100% "stale"
 *
 * To work around this, the script:
 * - Resets the modification dates of all config / src files to a time in the
 *   far past
 * - Grabs all changed paths for the branch
 * - Tweaks the modification date of all changed paths
 *
 * This gets the cache / git in sync, albeit in a very gross manner 🤭
 */

async function run() {
  const branchName = process.env.TRAVIS_PULL_REQUEST_BRANCH;
  if (!branchName || branchName === 'master') {
    console.log('Skipping build cache for master');
    return;
  }

  await resetConfigModifiedDates();
  await resetSourceModifiedDates();
  await restoreDistFiles();
  await touchModifiedFiles(await findBranchChanges());
}

run();

async function restoreDistFiles() {
  await fs.mkdirp('./tsbuildcache');

  if (await fs.pathExists('./tsbuildcache/cache.tar')) {
    await exec('tar -xf ./tsbuildcache/cache.tar');
  }
}

async function resetConfigModifiedDates() {
  await exec(`${resetModifiedTimesCommand} ./packages/tsconfig_base.json`);
  await exec(
    `find ./packages/*/tsconfig.json -exec ${resetModifiedTimesCommand} {} +`,
  );
  await exec(`find ./config -exec ${resetModifiedTimesCommand} {} +`);
}

async function resetSourceModifiedDates() {
  await exec(`find ./packages/*/src -exec ${resetModifiedTimesCommand} {} +`);
}

async function fetchMasterCommits() {
  await exec(`git remote set-branches origin 'master'`);
  await exec(`git fetch -v`);
}

async function findBranchChanges() {
  await fetchMasterCommits();

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

async function touchModifiedFiles(files) {
  console.log('Invalidating build cache for changed files:');
  const touches = files.map(async file => {
    console.log(`  ∙ ${file}`);
    await exec(`touch ${file}`);
  });
  await Promise.all(touches);
}
