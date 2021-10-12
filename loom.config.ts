import {createWorkspace, createWorkspaceTestPlugin} from '@shopify/loom';
import {eslint} from '@shopify/loom-plugin-eslint';
import {jest} from '@shopify/loom-plugin-jest';
import {prettier} from '@shopify/loom-plugin-prettier';
import {workspaceTypeScript} from '@shopify/loom-plugin-typescript';

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
