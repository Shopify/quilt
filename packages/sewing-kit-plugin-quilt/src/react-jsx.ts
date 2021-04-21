import {createProjectPlugin} from '@sewing-kit/plugins';
import {updateBabelPreset} from '@sewing-kit/plugin-javascript';

// eslint-disable-next-line no-warning-comments
// TODO: should be in the React plugin
export function reactJsxRuntime({preact = false} = {}) {
  return createProjectPlugin('Quilt.ReactJsxRuntime', ({tasks}) => {
    const updateReactBabelPreset = updateBabelPreset(['@babel/preset-react'], {
      runtime: 'automatic',
      importSource: preact ? 'preact' : 'react',
    });

    tasks.build.hook(({hooks}) => {
      hooks.target.hook(({hooks}) => {
        hooks.configure.hook(({babelConfig}) => {
          babelConfig?.hook(updateReactBabelPreset);
        });
      });
    });

    tasks.dev.hook(({hooks}) => {
      hooks.configure.hook(({babelConfig}) => {
        babelConfig?.hook(updateReactBabelPreset);
      });
    });

    tasks.test.hook(({hooks}) => {
      hooks.configure.hook(({babelConfig}) => {
        babelConfig?.hook(updateReactBabelPreset);
      });
    });
  });
}
