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
    runWorkspaceTests(),
  );
});

function runWorkspaceTests() {
  return createWorkspaceTestPlugin('SK.WorkspaceTests', ({hooks}) => {
    hooks.configure.hook((hooks) => {
      hooks.jestConfig?.hook((config) => {
        if (Array.isArray(config.projects)) {
          config.projects.unshift({
            ...(config.projects[0] as any),
            displayName: 'root',
            rootDir: 'tests',
          });
        }
        return config;
      });
    });
  });
}
