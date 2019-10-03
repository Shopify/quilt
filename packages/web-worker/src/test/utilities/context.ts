import {Workspace, createWorkspace} from './workspace';
import {AppServer, createServer} from './server';
import {AppBrowser, createBrowser} from './browser';

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
