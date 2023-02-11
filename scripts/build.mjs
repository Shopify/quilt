/**
 * A script that builds all package using rollup.
 *
 * Functionally similar to `yarn workspaces run rollup -c`, except this script
 * runs the builds in parallel rather than sequentially.
 * Parallelisation and avoiding the overhead of starting up a new node process
 * for each package means that this script builds all packages in ~10 seconds,
 * compared to `yarn workspaces run rollup -c` taking ~60 seconds.
 */

import path from 'path';
import url from 'url';
import {fileURLToPath} from 'url';
import chalk from 'chalk';
import {rollup} from 'rollup';
import loadConfigFile from 'rollup/loadConfigFile';
import glob from 'glob';

const repoRoot = url.fileURLToPath(new URL('..', import.meta.url));
const configFilePaths = glob.sync('packages/*/rollup.config.mjs', {
  cwd: repoRoot,
  absolute: true,
});

(async function () {
  await Promise.all(configFilePaths.map((configPath) => runRollup(configPath)));
})();

async function runRollup(configPath) {
  const packagePath = path.dirname(configPath);

  const packageName = path.basename(packagePath);

  const prefix = chalk.cyan(`packages/${packageName}: `);
  const prefixError = chalk.red(`packages/${packageName}: `);

  const {options, warnings} = await loadConfigFile(configPath);

  if (warnings.count > 0) {
    console.log(prefix);
    warnings.flush();
  }

  for (const optionsObj of options) {
    try {
      const bundle = await rollup({
        ...optionsObj,
        onwarn: (warning, warn) => warn(`${prefixError}${warning}`),
      });
      const result = await Promise.all(optionsObj.output.map(bundle.write));
      warnings.flush();
    } catch (err) {
      err.message = `${prefixError}${err.message}`;
      throw err;
    }

    const logOutputs = optionsObj.output
      .map(({dir = ''}) => path.relative(packagePath, dir))
      .filter(Boolean)
      .join(', ');

    const logInputs = optionsObj.input
      .map((input) => path.relative(packagePath, input))
      .join(', ');

    if (logOutputs) {
      console.log(`${prefix}Created ${logOutputs} for input(s): ${logInputs}`);
    }
  }
}
