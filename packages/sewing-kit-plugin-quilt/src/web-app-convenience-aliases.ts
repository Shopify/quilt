import {WebApp, createProjectPlugin} from '@sewing-kit/plugins';

export function webAppConvenienceAliases() {
  return createProjectPlugin<WebApp>(
    'Quilt.WebAppConvenienceAliases',
    ({project, tasks: {dev, build, test}}) => {
      dev.hook(({hooks}) => {
        hooks.configure.hook((configure) => {
          configure.webpackAliases?.hook(addWebpackAliases);
        });
      });

      build.hook(({hooks}) => {
        hooks.target.hook(({hooks}) => {
          hooks.configure.hook((configuration) => {
            configuration.webpackAliases?.hook(addWebpackAliases);
          });
        });
      });

      test.hook(({hooks}) => {
        hooks.configure.hook((configure) => {
          configure.jestModuleMapper?.hook((moduleMapper) => ({
            ...moduleMapper,
            '^components': project.fs.resolvePath('components'),
            '^utilities/(.*)': project.fs.resolvePath('utilities/$1'),
            '^tests/(.*)': project.fs.resolvePath('tests/$1'),
          }));
        });
      });

      function addWebpackAliases(aliases: {[key: string]: string}) {
        return {
          ...aliases,
          components$: project.fs.resolvePath('components'),
          utilities: project.fs.resolvePath('utilities'),
        };
      }
    },
  );
}
