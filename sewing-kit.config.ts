import {createWorkspace} from '@sewing-kit/config';
import {createWorkspaceBuildPlugin} from '@sewing-kit/plugins';
import {eslint} from '@sewing-kit/plugin-eslint';
import {jest} from '@sewing-kit/plugin-jest';
import {workspaceTypeScript} from '@sewing-kit/plugin-typescript';

export default createWorkspace(workspace => {
  workspace.use(
    eslint(),
    jest(),
    workspaceTypeScript(),
    createWorkspaceBuildPlugin('Quilt.Build', ({hooks}) => {
      hooks.configure.hook(hooks => {
        hooks.babelConfig?.hook(_ => ({
          presets: [
            ['babel-preset-shopify/node', {typescript: true}],
            'babel-preset-shopify/react',
          ],
          sourceMaps: 'inline',
        }));
      });
    }),
  );
});
