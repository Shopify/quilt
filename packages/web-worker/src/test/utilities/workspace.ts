import * as path from 'path';
import * as fs from 'fs-extra';

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
    await fs.writeFile(filePath, contents);
  }

  async cleanup() {
    await fs.emptyDir(this.root);
    await fs.remove(this.root);
  }
}

const rootFixtureDirectory = path.resolve(__dirname, '../fixtures');

export async function createWorkspace({name}: {name: string}) {
  const fixtureDirectory = path.join(rootFixtureDirectory, name);
  await fs.mkdirp(fixtureDirectory);
  await fs.writeFile(path.join(fixtureDirectory, '.gitignore'), '*');
  return new Workspace(fixtureDirectory);
}
