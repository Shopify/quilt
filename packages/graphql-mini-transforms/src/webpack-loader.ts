import {dirname} from 'path';

import type {LoaderContext} from 'webpack';
import {parse, DocumentNode} from 'graphql';

import {cleanDocument, extractImports, toSimpleDocument} from './document';

interface Options {
  simple?: boolean;
}
// release comment
export default async function graphQLLoader(
  this: LoaderContext<Options>,
  source: string | Buffer,
) {
  this.cacheable();

  const done = this.async();
  const {simple = false} = this.getOptions();

  if (done == null) {
    throw new Error(
      '@shopify/graphql-loader does not support synchronous processing',
    );
  }

  try {
    const document = cleanDocument(
      await loadDocument(source, this.context, this),
    );
    const exported = simple ? toSimpleDocument(document) : document;

    done(
      null,
      `export default JSON.parse(${JSON.stringify(JSON.stringify(exported))});`,
    );
  } catch (error) {
    done(error);
  }
}

async function loadDocument(
  rawSource: string | Buffer,
  resolveContext: string,
  loader: LoaderContext<Options>,
): Promise<DocumentNode> {
  const normalizedSource =
    typeof rawSource === 'string' ? rawSource : rawSource.toString();

  const {imports, source} = extractImports(normalizedSource);
  const document = parse(source);

  if (imports.length === 0) {
    return document;
  }

  const resolvedImports = await Promise.all(
    imports.map(async (imported) => {
      const resolvedPath = await new Promise<string>((resolve, reject) => {
        loader.resolve(resolveContext, imported, (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            loader.addDependency(result);
            resolve(result);
          }
        });
      });

      const source = await new Promise<string>((resolve, reject) => {
        loader.fs.readFile(
          resolvedPath,
          (error: Error | null, result: string) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
      });

      return loadDocument(source, dirname(resolvedPath), loader);
    }),
  );

  for (const {definitions} of resolvedImports) {
    (document.definitions as any[]).push(...definitions);
  }

  return document;
}
