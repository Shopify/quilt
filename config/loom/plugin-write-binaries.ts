import {relative, dirname, join} from 'path';

import {
  Package,
  createProjectBuildPlugin,
  ProjectPluginContext,
} from '@shopify/loom';

import {findCommonAncestorPath} from './common-ancestor-path';

export function writeBinaries() {
  return createProjectBuildPlugin<Package>(
    'BuildLibrary.Binaries',
    ({hooks, project, api}) => {
      hooks.steps.hook((steps) =>
        project.binaries.length > 0
          ? [...steps, createWriteBinariesStep({project, api})]
          : steps,
      );
    },
  );
}

function createWriteBinariesStep({
  project,
  api,
}: Pick<ProjectPluginContext<Package>, 'project' | 'api'>) {
  return api.createStep(
    {id: 'BuildLibrary.Binaries', label: `Write binaries`},
    async (step) => {
      const commonEntryRoot = findCommonAncestorPath(
        ...(await Promise.all(
          // eslint-disable-next-line @typescript-eslint/require-await
          [...project.entries, ...project.binaries].map(async ({root}) =>
            dirname(project.fs.resolvePath(root)),
          ),
        )),
      );

      // This is present as a typeguard that should never trigger as
      // findCommonAncestorPath will only return null if you're on windows and you
      // feed it files that are on different drives - which should never occur if
      // you're building a project that is contained within a single folder
      if (commonEntryRoot === null) {
        throw new Error(
          'Could not find a common ancestor folder for all your entrypoints',
        );
      }

      await Promise.all(
        project.binaries.map(async ({name, root, aliases = []}) => {
          const binaryPath = project.fs.resolvePath(root);
          const sourceFileRelativeToCommonRoot = relative(
            commonEntryRoot,
            binaryPath,
          );

          const pathToBuiltBinary = `./${relative(
            project.fs.resolvePath('bin'),
            join(
              project.fs.resolvePath('build/cjs'),
              sourceFileRelativeToCommonRoot.replace(/\.[^.]+$/, '.js'),
            ),
          )}`;

          for (const binaryName of [name, ...aliases]) {
            const binaryFile = project.fs.resolvePath('bin', binaryName);

            await project.fs.write(
              binaryFile,
              `#!/usr/bin/env node\nrequire(${JSON.stringify(
                pathToBuiltBinary,
              )})`,
            );

            await step.exec('chmod', ['+x', binaryFile]);
          }
        }),
      );
    },
  );
}
