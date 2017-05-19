import {EventEmitter} from 'events';
import {buildClientSchema, GraphQLSchema, DocumentNode, parse, Source, concatAST} from 'graphql';
import {readJSON, readFile, writeFile} from 'fs-extra';
import {watch} from 'chokidar';
import * as glob from 'glob';
import {compile, Operation, Fragment, AST} from 'graphql-tool-utilities/ast';

import buildAST from './ast';
import {printFile} from './print';

export interface Options {
  graphQLFiles: string,
  schemaPath: string,
}

export interface RunOptions {
  watch?: boolean,
}

export interface Build {
  documentPath: string,
  definitionPath: string,
  operation?: Operation,
  fragment?: Fragment,
}

export class Builder extends EventEmitter {
  watching: boolean;
  private globs: string;
  private schemaPath: string;
  private documentCache = new Map<string, DocumentNode>();

  constructor({
    graphQLFiles,
    schemaPath,
  }: Options) {
    super();
    this.globs = graphQLFiles;
    this.schemaPath = schemaPath;
  }

  on(event: 'error', handler: (error: Error) => void): this
  on(event: 'build', handler: (built: Build) => void): this
  on(event: 'start', handler: () => void): this
  on(event: 'end', handler: () => void): this
  on(event: string, handler: (...args: any[]) => void): this {
    return super.on(event, handler);
  }

  emit(event: 'error', error: Error): boolean
  emit(event: 'build', built: Build): boolean
  emit(event: 'start'): boolean
  emit(event: 'end'): boolean
  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  async run({watch: watchGlobs = false} = {}) {
    const {schemaPath, globs, documentCache} = this;
    let schema: GraphQLSchema;

    const generate = async () => {
      this.emit('start');
      let ast: AST;

      try {
        ast = compile(schema, concatAST(Array.from(documentCache.values())));
      } catch (error) {
        this.emit(error);
        return;
      }

      const fileMap = groupOperationsAndFragmentsByFile(ast);
      await Promise.all(
        Object
          .keys(fileMap)
          .map(async (key) => {
            const file = fileMap[key];
            const definition = printFile(file, ast);
            const definitionPath = `${file.path}.d.ts`;
            await writeFile(definitionPath, definition);

            const build = {
              documentPath: file.path,
              definitionPath,
              operation: file.operation,
              fragment: file.fragment,
            };

            this.emit('build', build);
          })
      );

      this.emit('end');
    };

    const update = async (file: string) => {
      try {
        await this.updateDocumentForFile(file);
      } catch (error) {
        return;
      }

      await generate();
    };

    const remove = async (file: string) => {
      this.removeDocumentForFile(file);
      await generate();
    };

    if (watchGlobs) {
      const watcher = watch(globs);
      watcher.on('ready', () => {
        watcher.on('add', update);
        watcher.on('change', update);
        watcher.on('unlink', remove);
      });
    }

    try {
      const schemaJSON = await readJSON(schemaPath, 'utf8');
      schema = buildClientSchema(schemaJSON.data);
    } catch (error) {
      const parseError = new Error(`Error parsing '${schemaPath}':\n\n${error.message.replace(/Syntax Error GraphQL \(.*?\) /, '')}`);
      this.emit('error', parseError);
      return;
    }

    try {
      await Promise.all(
        glob
          .sync(globs)
          .map(this.updateDocumentForFile.bind(this))
      );
    } catch (error) {
      return;
    }

    await generate();
  }

  private async updateDocumentForFile(file: string) {
    try {
      const contents = await readFile(file, 'utf8');
      if (contents.trim().length === 0) { return; }

      const document = parse(new Source(contents, file));
      this.documentCache.set(file, document);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  private removeDocumentForFile(file: string) {
    this.documentCache.delete(file);
  }
}

// export default function graphQLToTypeScriptDefinitions(options: Options) {
//   const ast = buildAST(options);
//   const fileMap = groupQueriesAndFragmentsByFile(ast);

//   Object.keys(fileMap).forEach((path) => {
//     const file = fileMap[path];

//     const content = printFile(file, ast);
//     if (!content) { return; }

//     const newFile = `${file.path}.d.ts`;
//     writeFileSync(newFile, content);
//   });
// }

interface File {
  path: string,
  operation?: Operation,
  fragment?: Fragment,
}

interface FileMap {
  [key: string]: File,
}

function groupOperationsAndFragmentsByFile({operations, fragments}: AST): FileMap {
  const map: FileMap = {};

  Object
    .keys(operations)
    .forEach((name) => {
      const operation = operations[name];
      map[operation.filePath] = {
        path: operation.filePath,
        operation,
      };
    });
  
  Object
    .keys(fragments)
    .forEach((name) => {
      const fragment = fragments[name];
      map[fragment.filePath] = {
        path: fragment.filePath,
        fragment,
      };
    });
  
  return map;
}
