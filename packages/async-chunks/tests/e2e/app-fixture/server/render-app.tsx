import * as React from 'react';
import {Context} from 'koa';
import {resolve} from 'path';
import {readJSONSync} from 'fs-extra';
import {renderToString} from 'react-dom/server';
import HTML, {DOCTYPE} from '@shopify/react-html';
import {CaptureChunks} from '@shopify/async-chunks';

import App from '../app';
import {vendorBundleUrl, cdnUrl} from '../config/server';

const assetsPath = resolve(__dirname, '../build/client/assets.json');

export default async function renderApp(ctx: Context) {
  const {asyncChunks} = ctx.state;
  const modules: string[] = [];
  const {js, css} = readJSONSync(assetsPath).entrypoints.main;
  const scripts =
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV === 'development'
      ? [{path: vendorBundleUrl}, ...js]
      : js;

  const appElement = (
    // eslint-disable-next-line react/jsx-no-bind
    <CaptureChunks report={(moduleName: string) => modules.push(moduleName)}>
      <App />
    </CaptureChunks>
  );

  // Render appElement so modules get populated
  renderToString(appElement);

  const {
    scripts: asyncBundleScripts,
    styles: asyncBundleStyles,
  } = await asyncChunks.chunks(modules);

  const mainBundle = scripts.find((bundle: any) =>
    bundle.path.startsWith(`${cdnUrl}main`),
  );
  const scriptsWithoutMain = scripts.filter(
    (bundle: any) => bundle !== mainBundle,
  );
  const scriptsWithAsyncBundles = mainBundle
    ? [...scriptsWithoutMain, ...asyncBundleScripts, mainBundle]
    : [...scriptsWithoutMain, ...asyncBundleScripts];

  const stylesWithAsyncBundles = [...css, ...asyncBundleStyles];

  try {
    ctx.status = 200;
    ctx.body =
      DOCTYPE +
      renderToString(
        // eslint-disable-next-line react/jsx-pascal-case
        <HTML scripts={scriptsWithAsyncBundles} styles={stylesWithAsyncBundles}>
          {appElement}
        </HTML>,
      );
  } catch (error) {
    throw error;
  }
}
