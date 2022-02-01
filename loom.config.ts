import {createWorkspace, createWorkspaceTestPlugin} from '@shopify/loom';
import {
  buildLibrary,
  buildLibraryWorkspace,
} from '@shopify/loom-plugin-build-library';
import {eslint} from '@shopify/loom-plugin-eslint';
import {prettier} from '@shopify/loom-plugin-prettier';

// Needed so TS realises what configuration hooks are provided by Jest
import type {} from '@shopify/loom-plugin-jest';

export default createWorkspace((workspace) => {
  workspace.use(
    buildLibraryWorkspace(),
    eslint(),
    prettier({files: '**/*.{md,json,yaml,yml}'}),
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
