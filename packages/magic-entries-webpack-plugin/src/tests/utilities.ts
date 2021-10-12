import {resolve, dirname, join} from 'path';

import {writeFile, mkdirp, emptyDir, remove} from 'fs-extra';

export class Workspace {
  constructor(public readonly root: string) {}

  resolvePath(...parts: string[]) {
    return resolve(this.root, ...parts);
  }

  buildPath(...parts: string[]) {
    return this.resolvePath('build', ...parts);
  }

  async write(file: string, contents: string) {
    const filePath = this.resolvePath(file);
    await mkdirp(dirname(filePath));
    await writeFile(filePath, contents);
  }

  async cleanup() {
    await emptyDir(this.root);
    await remove(this.root);
  }
}

const rootFixtureDirectory = resolve(__dirname, '../fixtures');

export async function createWorkspace({name}: {name: string}) {
  const fixtureDirectory = join(rootFixtureDirectory, name);
  await mkdirp(fixtureDirectory);
  await writeFile(join(fixtureDirectory, '.gitignore'), '*');
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
