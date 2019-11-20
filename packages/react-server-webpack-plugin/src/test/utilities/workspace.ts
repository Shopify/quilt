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
    await fs.writeFile(filePath, contents, {encoding: 'utf8'});
  }

  async cleanup() {
    await fs.emptyDir(this.root);
    await fs.remove(this.root);
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

export async function withWorkspace(
  name: string,
  runner: (context: {workspace: Workspace}) => any,
) {
  const workspace = await createWorkspace({name});

  try {
    await runner({workspace});
  } finally {
    await workspace.cleanup();
  }
}
