const {exec: rawExec, execSync} = require('child_process');
const {promisify} = require('util');

const fs = require('fs-extra');

function gracefulExit(err) {
  // eslint-disable-next-line no-console
  console.log('Error setting up build cache', err);
  process.stdout.write('\n', () => {
    process.exit(1);
  });
}

async function exec(command) {
  const {stdout, stderr} = await promisify(rawExec);
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
}

module.exports = {
  gracefulExit,
  exec,
};
