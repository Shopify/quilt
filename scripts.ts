import {resolve} from 'path';
import {execSync} from 'child_process';
import glob from 'glob';

const packages = glob.sync(resolve(__dirname, 'packages/*'));
packages.forEach((path: string) => {
  console.log('\n\n~~~~~~~~~~ Removing typescript from ', path);
  execSync('yarn remove typescript', {cwd: path, stdio: 'inherit'});
});
