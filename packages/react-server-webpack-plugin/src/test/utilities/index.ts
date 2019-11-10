import {AppBrowser, createBrowser} from './browser';
import {AppServer, createServer} from './server';
import {Workspace, createWorkspace} from './workspace';

export interface Context {
  workspace: Workspace;
  browser: AppBrowser;
  server: AppServer;
}

export async function withWorkspace(
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
