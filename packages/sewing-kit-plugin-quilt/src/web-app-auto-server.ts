import {
  createProjectPlugin,
  WebApp,
  TargetBuilder,
  TargetRuntime,
  Runtime,
  WaterfallHook,
  addHooks,
} from '@sewing-kit/plugins';
import type {Manifest} from '@quilted/async/assets';

import {excludeNonPolyfillEntries} from './shared';
import {
  MAGIC_MODULE_APP_COMPONENT,
  MAGIC_MODULE_APP_AUTO_SERVER_ASSETS,
} from './constants';

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
    ({project, tasks, api, workspace}) => {
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
            async (step) => {
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

      tasks.build.hook(({hooks}) => {
        hooks.configureHooks.hook(addCustomHooks);

        hooks.targets.hook((targets) => [
          ...targets,
          new TargetBuilder({
            project,
            options: [{quiltAutoServer: true}],
            runtime: new TargetRuntime([Runtime.Node]),
            needs: targets.filter((target) => target.default),
          }),
        ]);

        hooks.target.hook(({target, hooks}) => {
          if (!target.options.quiltAutoServer) return;

          hooks.configure.hook((configuration) => {
            if (defaultHost) {
              configuration.quiltAutoServerHost!.hook(() => defaultHost);
            }

            if (defaultPort) {
              configuration.quiltAutoServerPort!.hook(() => defaultPort);
            }

            const entry = api.tmpPath(`quilt/${project.name}-auto-server.js`);
            const assetsPath = api.tmpPath(
              `quilt/${project.name}-auto-server-assets.js`,
            );

            configuration.webpackOutputFilename?.hook(() => 'index.js');

            configuration.webpackEntries?.hook((entries) => [
              ...excludeNonPolyfillEntries(entries),
              entry,
            ]);

            configuration.webpackAliases?.hook((aliases) => ({
              ...aliases,
              [MAGIC_MODULE_APP_AUTO_SERVER_ASSETS]: assetsPath,
            }));

            configuration.webpackPlugins?.hook(async (plugins) => {
              const {default: WebpackVirtualModules} = await import(
                'webpack-virtual-modules'
              );

              const manifestFiles = await project.fs.glob(
                workspace.fs.buildPath(
                  workspace.webApps.length > 1 ? `apps/${project.name}` : 'app',
                  '**/*.manifest.json',
                ),
              );
              const manifests: Manifest[] = await Promise.all(
                manifestFiles.map(async (file) =>
                  JSON.parse(await workspace.fs.read(file)),
                ),
              );

              let serverEntrySource = await configuration.quiltAutoServerContent!.run(
                undefined,
              );

              if (!serverEntrySource) {
                const [port, host] = await Promise.all([
                  configuration.quiltAutoServerPort!.run(3003),
                  configuration.quiltAutoServerHost!.run('localhost'),
                ]);

                serverEntrySource = `
                  import App from ${JSON.stringify(MAGIC_MODULE_APP_COMPONENT)};
                  import assets from ${JSON.stringify(
                    MAGIC_MODULE_APP_AUTO_SERVER_ASSETS,
                  )};
  
                  import {createServer} from 'http';
  
                  import {render, runApp, Html} from '@quilted/quilt/server';
  
                  process.on('uncaughtException', (...args) => {
                    console.error(...args);
                  });
  
                  console.log('Creating server: http://${host}:${port}');
                  
                  createServer(async (request, response) => {
                    const {html, http, markup, asyncAssets} = await runApp(<App />, {
                      url: new URL(request.path, 'http://' + request.host),
                    });
                  
                    const {headers, statusCode = 200} = http.state;
                    const usedAssets = asyncAssets.used({timing: 'immediate'});

                    const assetOptions = {userAgent: request.getHeader('User-Agent')};
                  
                    const [styles, scripts, preload] = await Promise.all([
                      assets.styles({async: usedAssets, options: assetOptions}),
                      assets.scripts({async: usedAssets, options: assetOptions}),
                      assets.asyncAssets(asyncAssets.used({timing: 'soon'}), {
                        options: assetOptions,
                      }),
                    ]);
  
                    response.writeHead(
                      statusCode,
                      [...headers].reduce((allHeaders, [key, value]) => {
                        allHeaders[key] = value;
                        return allHeaders;
                      }, {}),
                    );
  
                    response.write(
                      render(
                        <Html manager={html} styles={styles} scripts={scripts} preloadAssets={preload}>
                          {markup}
                        </Html>,
                      ),
                    );
  
                    response.end();
                  }).listen(${port}, ${JSON.stringify(host)});
                `;
              }

              return [
                ...plugins,
                new WebpackVirtualModules({
                  [assetsPath]: `
                    import {createAssetLoader} from '@quilted/async/assets';

                    const manifests = ${JSON.stringify(manifests.reverse())};

                    // TODO: this will not scale too well once we introduce locales, too!
                    const assets = createAssetLoader({
                      getManifest: (options) => {
                        const manifest = manifests.find((manifest) => {
                          return manifest.match.every((aMatch) => {
                            switch (aMatch.type) {
                              case 'regex': {
                                return new RegExp(aMatch.source).test(options[aMatch.key]);
                              }
                              default: {
                                throw new Error('Can’t handle match: ', aMatch);
                              }
                            }
                          });
                        }) || manifests.find((manifest) => manifest.default);

                        if (manifest == null) {
                          throw new Error('No manifest found for options: ', options);
                        }

                        return Promise.resolve(manifest);
                      },
                    });
  
                    export default assets;
                  `,
                  [entry]: serverEntrySource,
                }),
              ];
            });
          });
        });
      });
    },
  );
}
