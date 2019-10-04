/**
 * @jest-environment node
 */

import * as path from 'path';
import {WebWorkerPlugin} from '../webpack-parts';
import {withContext, Context, runWebpack as runWebpackBase} from './utilities';

const babelPlugin = path.resolve(__dirname, '../babel-plugin.ts');
const mainFile = 'src/main.js';
const workerFile = 'src/worker.js';

jest.setTimeout(10_000);

describe('web-workers', () => {
  it('creates a worker factory that can produce workers that act like the original module', async () => {
    const greetingPrefix = 'Hello ';
    const greetingTarget = 'world';
    const testId = 'WorkerResult';

    await withContext('basic-result', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-workers';

          const worker = createWorker(() => import('./worker'))();

          (async () => {
            const result = await worker.greet(${JSON.stringify(
              greetingTarget,
            )});
            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            element.textContent = result;
            document.body.appendChild(element);
          })();
        `,
      );

      await workspace.write(
        workerFile,
        `
          export function greet(name) {
            return \`${greetingPrefix}\${name}\`;
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      expect(await workerElement.evaluate(element => element.innerHTML)).toBe(
        `${greetingPrefix}${greetingTarget}`,
      );
    });
  });

  it('creates a worker that propagates thrown errors', async () => {
    const errorMessage = 'Something went wrong!';
    const testId = 'WorkerResult';

    await withContext('thrown-error', async context => {
      const {workspace, browser, server} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-workers';

          const worker = createWorker(() => import('./worker'))();

          (async () => {
            let content = '';

            try {
              await worker.blowUp();
              content = 'All clear!';
            } catch (error) {
              content = error.message + error.stack;
            }

            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            element.textContent = content;
            document.body.appendChild(element);
          })();
        `,
      );

      await workspace.write(
        workerFile,
        `
          export function blowUp() {
            throw new Error(${JSON.stringify(errorMessage)});
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      const textContent = await workerElement.evaluate(
        element => element.innerHTML,
      );

      expect(textContent).toContain(errorMessage);
      expect(textContent).toContain(server.assetUrl('worker.worker.js').href);
    });
  });
});

function runWebpack(context: Context, plugin = new WebWorkerPlugin()) {
  return runWebpackBase(context, {
    entry: context.workspace.resolvePath(mainFile),
    plugins: [plugin],
    module: {
      rules: [
        {
          include: context.workspace.resolvePath(mainFile),
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                plugins: [babelPlugin],
              },
            },
          ],
        },
      ],
    },
  });
}
