import path from 'path';

import fs from 'fs-extra';

import {WebpackOptions, runWebpack} from './webpack';

export class Workspace {
  constructor(public readonly root: string) {}

  resolvePath(...parts: string[]) {
    return path.resolve(this.root, ...parts);
  }

  buildPath(...parts: string[]) {
    return this.resolvePath('build', ...parts);
  }

  async write(file: string, contents: string) {
    const filePath = this.resolvePath(file);
    await fs.mkdirp(path.dirname(filePath));
    await fs.writeFile(filePath, contents, {encoding: 'utf8'});
  }

  async cleanup() {
    await fs.emptyDir(this.root);
    await fs.remove(this.root);
  }

  async build(options?: Partial<WebpackOptions>) {
    return runWebpack(this.root, {outputPath: this.buildPath(), ...options});
  }
}

export async function createWorkspace({
  name,
  rootFixtureDirectory = path.resolve(__dirname, '../fixtures'),
}: {
  name: string;
  rootFixtureDirectory?: string;
}) {
  const fixtureDirectory = path.join(rootFixtureDirectory, name);
  await fs.mkdirp(fixtureDirectory);
  await fs.writeFile(path.join(fixtureDirectory, '.gitignore'), '*');
  return new Workspace(fixtureDirectory);
}
