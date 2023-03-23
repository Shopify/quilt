import type {Workspace} from './workspace';
import {createWorkspace} from './workspace';
import type {AppServer} from './server';
import {createServer} from './server';
import type {AppBrowser} from './browser';
import {createBrowser} from './browser';

export interface Context {
  readonly workspace: Workspace;
  readonly browser: AppBrowser;
  readonly server: AppServer;
}

export async function withContext(
  name: string,
  runner: (context: Context) => any,
) {
  const workspace = await createWorkspace({name});
  const server = await createServer({serve: workspace.buildPath()});
  const browser = await createBrowser({url: server.url()});

  try {
    await runner({workspace, browser, server});
  } finally {
    await workspace.cleanup();
    await browser.terminate();
    await server.terminate();
  }
}
