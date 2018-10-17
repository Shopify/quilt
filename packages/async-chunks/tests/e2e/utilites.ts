import {execSync} from 'child_process';
import {join, resolve} from 'path';
// import {readJSONSync} from 'fs-extra';

// function asyncChunkManifest(fixtureBuildPath: string): string[] {
//   return readJSONSync(join(fixtureBuildPath, 'async-chunks.json'));
// }

export const sewingKitCLI = resolve(
  __dirname,
  './app-fixture/.yalc/@shopify/sewing-kit/bin/sewing-kit',
);

export function yarnInstall(fixtureDir: string) {
  execSync('yarn install --mutex file:/tmp/.yarn-mutex', {
    cwd: fixtureDir,
    stdio: 'inherit',
  });
}

export function runBuild(fixtureDir: string) {
  execSync(`yarn run sewing-kit build`, {
    cwd: fixtureDir,
    stdio: 'inherit',
  });
}
