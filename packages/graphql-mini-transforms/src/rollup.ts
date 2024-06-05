import * as fs from 'fs';

import {parse} from 'graphql';
import type {DocumentNode} from 'graphql';
import type {Plugin, PluginContext} from 'rollup';

import {cleanDocument, extractImports, formatDocument} from './document';
import type {OutputFormat} from './document';

interface Options {
  /** @deprecated Use `format: 'simple'` instead. */
  simple?: boolean;

  /**
   * Controls the runtime code that will be generated for the GraphQL document.
   */
  format?: OutputFormat;
}

export function graphql({
  simple = false,
  format = simple ? 'simple' : 'document',
}: Options = {}): Plugin {
  return {
    name: '@shopify/graphql-mini-transforms',
    async transform(code, id) {
      if (!id.endsWith('.graphql')) return null;

      const topLevelDefinitions = new Set();

      const loadedDocument = await loadDocument(
        code,
        id,
        this,
        (document, level) => {
          if (level !== 0) return;

          for (const definition of document.definitions) {
            if ('name' in definition && definition.name != null) {
              topLevelDefinitions.add(definition.name.value);
            }
          }
        },
      );

      const document = cleanDocument(loadedDocument);
      const exported = formatDocument(document, format);

      return {code: `export default ${JSON.stringify(exported)}`, map: null};
    },
  };
}

async function loadDocument(
  code: string,
  file: string,
  plugin: PluginContext,
  add: (document: DocumentNode, level: number) => void,
  level = 0,
) {
  const {imports, source} = extractImports(code);
  const document = parse(source);

  add(document, level);

  if (imports.length === 0) {
    return document;
  }

  const resolvedImports = await Promise.all(
    imports.map(async (imported) => {
      const resolvedId = await plugin.resolve(imported, file);

      if (resolvedId == null) {
        throw new Error(
          `Could not find ${JSON.stringify(imported)} from ${JSON.stringify(
            file,
          )}`,
        );
      }

      plugin.addWatchFile(resolvedId.id);
      const contents = await fs.promises.readFile(resolvedId.id, {
        encoding: 'utf8',
      });

      return loadDocument(contents, resolvedId.id, plugin, add, level + 1);
    }),
  );

  for (const {definitions} of resolvedImports) {
    (document.definitions as any[]).push(...definitions);
  }

  return document;
}
