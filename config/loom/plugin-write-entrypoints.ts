import {relative, dirname, join} from 'path';

import {
  Package,
  createProjectBuildPlugin,
  ProjectPluginContext,
  Project,
} from '@shopify/loom';

import {findCommonAncestorPath} from './common-ancestor-path';

interface EntryConfig {
  extension: string;
  outputPath: string;
  exportStyle: 'commonjs' | 'esmodules';
}

interface BuildEntrypointsOptions {
  commonjs: boolean;
  esmodules: boolean;
  esnext: boolean;
}

export function writeEntrypoints(options: BuildEntrypointsOptions) {
  return createProjectBuildPlugin<Package>(
    'BuildLibrary.Entrypoints',
    ({hooks, project, api}) => {
      hooks.steps.hook((steps) => [
        ...steps,
        createWriteEntrypointsStep({project, api}, options),
      ]);
    },
  );
}

function createWriteEntrypointsStep(
  {project, api}: Pick<ProjectPluginContext<Package>, 'api' | 'project'>,
  options: BuildEntrypointsOptions,
) {
  return api.createStep(
    {id: 'BuildLibrary.Entrypoints', label: 'Write entrypoints'},
    async () => {
      const entryConfigs: EntryConfig[] = [];

      if (options.commonjs) {
        entryConfigs.push({
          exportStyle: 'commonjs',
          outputPath: project.fs.buildPath('cjs'),
          extension: '.js',
        });
      }

      if (options.esmodules) {
        entryConfigs.push({
          exportStyle: 'esmodules',
          outputPath: project.fs.buildPath('esm'),
          extension: '.mjs',
        });
      }

      if (options.esnext) {
        entryConfigs.push({
          exportStyle: 'esmodules',
          outputPath: project.fs.buildPath('esnext'),
          extension: '.esnext',
        });
      }

      await Promise.all(
        entryConfigs.map((config) => writeEntries(project, config)),
      );
    },
  );
}

async function writeEntries(
  project: Package,
  {extension, outputPath, exportStyle}: EntryConfig,
) {
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
    project.entries.map(async ({name, root}) => {
      const entryPath = project.fs.resolvePath(root);
      const entryRelativeToCommonRoot = relative(commonEntryRoot, entryPath);

      const pathToBuiltEntry = `./${relative(
        project.root,
        join(
          outputPath,
          `${entryRelativeToCommonRoot.replace(/\.[^.]+$/, extension)}`,
        ),
      )}`;

      const quotedPathToBuiltEntry = JSON.stringify(pathToBuiltEntry);
      const rootEntryFile = `${name ?? 'index'}${extension}`;

      const entryPointContent =
        exportStyle === 'commonjs'
          ? cjsEntrypointContent(quotedPathToBuiltEntry)
          : esmEntrypointContent(
              quotedPathToBuiltEntry,
              await entryHasDefaultExport(entryPath, project),
            );

      await project.fs.write(rootEntryFile, entryPointContent);
    }),
  );
}

async function entryHasDefaultExport(entryPath: string, project: Project) {
  try {
    const content = await project.fs.read(entryPath);

    // export default ...
    // export {Foo as default} from ...
    // export {default} from ...
    return (
      /(?:export|as) default\b/.test(content) || content.includes('{default}')
    );
  } catch {
    return true;
  }
}

function cjsEntrypointContent(quotedPath: string) {
  return `module.exports = require(${quotedPath});`;
}

function esmEntrypointContent(quotedPath: string, hasDefault: boolean) {
  return [
    `export * from ${quotedPath};`,
    hasDefault ? `export {default} from ${quotedPath};` : false,
  ]
    .filter(Boolean)
    .join('\n');
}
