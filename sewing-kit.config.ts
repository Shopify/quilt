import {createWorkspace, createWorkspaceTestPlugin} from '@sewing-kit/core';
import {eslint} from '@sewing-kit/plugin-eslint';
import {jest} from '@sewing-kit/plugin-jest';
import {prettier} from '@sewing-kit/plugin-prettier';
import {workspaceTypeScript} from '@sewing-kit/plugin-typescript';

export default createWorkspace((workspace) => {
  workspace.use(
    eslint(),
    prettier({files: '**/*.{md,json,yaml,yml}'}),
    jest(),
    workspaceTypeScript(),
    createWorkspaceTestPlugin('Quilt.WorkspaceTest', ({hooks}) => {
      hooks.configure.hook((hooks) => {
        hooks.jestConfig?.hook((config) => ({
          ...config,
          projects: [
            ...config.projects,
            {
              ...(config.projects[0] as any),
              displayName: 'quilt',
              rootDir: 'tests',
            },
          ],
          coverageDirectory: './coverage',
        }));
      });
    }),
  );
});
