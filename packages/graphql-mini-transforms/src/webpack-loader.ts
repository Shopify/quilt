import {dirname} from 'path';

import type {loader} from 'webpack';
import {parse, DocumentNode} from 'graphql';
import {getOptions} from 'loader-utils';

import {cleanDocument, extractImports, toSimpleDocument} from './document';

interface Options {
  simple?: boolean;
}

export default async function graphQLLoader(
  this: loader.LoaderContext,
  source: string | Buffer,
) {
  this.cacheable();

  const done = this.async();
  const {simple = false} = getOptions(this) as Options;

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
  loader: loader.LoaderContext,
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
          } else {
            loader.addDependency(result);
            resolve(result);
          }
        });
      });

      const source = await new Promise<string>((resolve, reject) => {
        loader.fs.readFile(
          resolvedPath,
          (error: Error | null, result?: string) => {
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
