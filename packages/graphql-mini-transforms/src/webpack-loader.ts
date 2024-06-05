import {dirname} from 'path';

import type {LoaderContext} from 'webpack';
import type {DocumentNode} from 'graphql';
import {parse} from 'graphql';

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

export default async function graphQLLoader(
  this: LoaderContext<Options>,
  source: string | Buffer,
) {
  this.cacheable();

  const done = this.async();
  const {simple = false, format = simple ? 'simple' : 'document'} =
    this.getOptions();

  if (done == null) {
    throw new Error(
      '@shopify/graphql-loader does not support synchronous processing',
    );
  }

  try {
    const document = cleanDocument(
      await loadDocument(source, this.context, this),
    );

    const exported = formatDocument(document, format);

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
          } else {
            const notFoundError = new Error(`Could not resolve ${imported}.`);
            reject(notFoundError);
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
