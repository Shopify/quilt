import {
  createProjectPlugin,
  WebApp,
  WaterfallHook,
  addHooks,
} from '@sewing-kit/plugins';

interface TargetOptions {
  readonly quiltAutoServer?: true;
}

interface CustomHooks {
  readonly quiltAutoServerContent: WaterfallHook<string | undefined>;
  readonly quiltAutoServerPort: WaterfallHook<number>;
  readonly quiltAutoServerHost: WaterfallHook<string>;
}

declare module '@sewing-kit/hooks' {
  interface BuildWebAppTargetOptions extends TargetOptions {}
  interface BuildWebAppConfigurationCustomHooks extends CustomHooks {}
  interface DevWebAppConfigurationCustomHooks extends CustomHooks {}
}

interface Options {
  readonly port?: number;
  readonly host?: string;
}

export function webAppAutoServer({
  host: defaultHost,
  port: defaultPort,
}: Options = {}) {
  return createProjectPlugin<WebApp>(
    'Quilt.WebAppAutoServer',
    ({tasks, api}) => {
      const addCustomHooks = addHooks<CustomHooks>(() => ({
        quiltAutoServerContent: new WaterfallHook(),
        quiltAutoServerPort: new WaterfallHook(),
        quiltAutoServerHost: new WaterfallHook(),
      }));

      tasks.dev.hook(({hooks}) => {
        hooks.configureHooks.hook(addCustomHooks);

        hooks.configure.hook(({quiltAutoServerHost, quiltAutoServerPort}) => {
          if (defaultHost) quiltAutoServerHost!.hook(() => defaultHost);
          if (defaultPort) quiltAutoServerPort!.hook(() => defaultPort);
        });

        hooks.steps.hook((steps, configuration) => [
          ...steps,
          api.createStep(
            {
              label: 'starting stating HTML development server',
              id: 'StaticHtml.DevServer',
            },
            step => {
              step.indefinite(async ({stdio}) => {
                const [{createServer}, {URL}] = await Promise.all([
                  import('http'),
                  import('url'),
                ]);

                const [
                  port,
                  host,
                  webpackPublicPath,
                  webpackOutputFilename,
                ] = await Promise.all([
                  configuration.quiltAutoServerPort!.run(3003),
                  configuration.quiltAutoServerHost!.run('localhost'),
                  configuration.webpackPublicPath!.run('/'),
                  configuration.webpackOutputFilename!.run('main.js'),
                ]);

                createServer((req, res) => {
                  stdio.stdout.write(`request for path: ${req.url}\n`);

                  res.writeHead(200, {
                    'Content-Type': 'text/html',
                    // 'Content-Security-Policy':
                    //   "default-src http://* https://* 'unsafe-eval'",
                  });

                  res.write(
                    `<html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, user-scalable=0">
                        </head>
                        <body>
                          <div id="app"></div>
                          <script src=${JSON.stringify(
                            new URL(webpackOutputFilename, webpackPublicPath)
                              .href,
                          )}></script>
                        </body>
                      </html>`,
                  );
                  res.end();
                }).listen(port, host, () => {
                  step.log(`App server listening on ${host}:${port}`);
                });
              });
            },
          ),
        ]);
      });
    },
  );
}
