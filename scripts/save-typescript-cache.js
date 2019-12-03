const {exec, gracefulExit} = require('./utilities');

process.on('uncaughtException', gracefulExit);
process.on('unhandledRejection', gracefulExit);

async function run() {
  await exec(`tar -cf tsbuildcache/cache.tar packages/*/dist`);
}

run();
