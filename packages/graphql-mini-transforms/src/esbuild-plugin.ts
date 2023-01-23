import fs from 'fs';

import {parse, DocumentNode} from 'graphql';
import type {Plugin, PluginBuild} from 'esbuild';

import {cleanDocument, extractImports} from './document';

const GraphQLMiniTransformPlugin: Plugin = {
  name: 'GraphQLMiniTransformPlugin',
  setup(build) {
    build.onLoad({filter: /\.graphql$/}, async ({path}) => {
      const document = cleanDocument(await loadDocument(path, build));
      return {
        contents: `export default JSON.parse(${JSON.stringify(
          JSON.stringify(document),
        )});`,
        loader: 'js',
      };
    });
  },
};

async function loadDocument(
  path: string,
  build: PluginBuild,
): Promise<DocumentNode> {
  const rawSource = await fs.promises.readFile(path);
  const normalizedSource =
    typeof rawSource === 'string' ? rawSource : rawSource.toString();

  const {imports, source} = extractImports(normalizedSource);
  const document = parse(source);

  if (imports.length === 0) {
    return document;
  }

  const resolvedImports = await Promise.all(
    imports.map(async (imported) => {
      const resolved = await build.resolve(imported, {
        kind: 'import-statement',
      });
      if (resolved.errors.length > 0) {
        throw new Error(resolved.errors.join(','));
      }
      return loadDocument(resolved.path, build);
    }),
  );

  for (const {definitions} of resolvedImports) {
    (document.definitions as any[]).push(...definitions);
  }

  return document;
}

export default GraphQLMiniTransformPlugin;
