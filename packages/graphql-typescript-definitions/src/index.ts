import {EventEmitter} from 'events';
import {
  buildClientSchema,
  GraphQLSchema,
  DocumentNode,
  DefinitionNode,
  OperationDefinitionNode,
  parse,
  Source,
  concatAST,
} from 'graphql';
import chalk from 'chalk';
import {dirname, resolve} from 'path';
import {readJSON, readFile, writeFile, mkdirp} from 'fs-extra';
import {watch} from 'chokidar';
import * as glob from 'glob';
import {
  getGraphQLConfig,
  GraphQLProjectConfig,
  GraphQLConfig,
} from 'graphql-config';
import {
  getGraphQLFilePath,
  getGraphQLProjectForSchemaPath,
  getGraphQLProjects,
  getGraphQLSchemaPaths,
} from 'graphql-tool-utilities';
import {
  compile,
  isOperation,
  Operation,
  Fragment,
  AST,
} from 'graphql-tool-utilities/ast';

import {printDocument, printSchema} from './print';
import {EnumFormat} from './types';

export {EnumFormat};

export interface Options {
  addTypename: boolean;
  enumFormat?: EnumFormat;
  schemaTypesPath: string;
}

export interface BuilderOptions extends Options {
  cwd?: string;
}

export interface RunOptions {
  watch?: boolean;
}

export interface SchemaBuild {
  schemaPath: string;
  schemaTypesPath: string;
}

export interface DocumentBuild {
  documentPath: string;
  definitionPath: string;
  operation?: Operation;
  fragments: Fragment[];
}

type GraphQLDocumentMapByProject = Map<
  string | undefined,
  Map<string, DocumentNode>
>;

export class Builder extends EventEmitter {
  private options: Options;
  // workspace graphql configuration
  // see: https://github.com/prisma/graphql-config
  private readonly config: GraphQLConfig;
  // projectName -> {filePath -> document}
  // NOTE: projectName can be undefined for nameless graphql-config projects
  private documentMapByProject: GraphQLDocumentMapByProject = new Map<
    string | undefined,
    Map<string, DocumentNode>
  >();

  constructor({cwd, ...options}: BuilderOptions) {
    super();
    this.options = options;

    this.config = getGraphQLConfig(cwd ? resolve(cwd) : undefined);
  }

  once(event: 'error', handler: (error: Error) => void): this;
  once(event: 'build:docs', handler: (built: DocumentBuild) => void): this;
  once(event: 'build:schema', handler: (built: SchemaBuild) => void): this;
  once(event: 'start:docs', handler: () => void): this;
  once(event: 'end:docs', handler: () => void): this;
  once(event: 'start:schema', handler: () => void): this;
  once(event: 'end:schema', handler: () => void): this;
  once(event: string, handler: (...args: any[]) => void): this {
    return super.once(event, handler);
  }

  on(event: 'error', handler: (error: Error) => void): this;
  on(event: 'build:docs', handler: (built: DocumentBuild) => void): this;
  on(event: 'build:schema', handler: (built: SchemaBuild) => void): this;
  on(event: 'start:docs', handler: () => void): this;
  on(event: 'end:docs', handler: () => void): this;
  on(event: 'start:schema', handler: () => void): this;
  on(event: 'end:schema', handler: () => void): this;
  on(event: string, handler: (...args: any[]) => void): this {
    return super.on(event, handler);
  }

  emit(event: 'error', error: Error): boolean;
  emit(event: 'build:docs', built: DocumentBuild): boolean;
  emit(event: 'build:schema', built: SchemaBuild): boolean;
  emit(event: 'start:docs'): boolean;
  emit(event: 'end:docs'): boolean;
  emit(event: 'start:schema'): boolean;
  emit(event: 'end:schema'): boolean;
  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  async run({watch: watchGlobs = false} = {}) {
    const globs = this.getGlobs();
    let schemaPaths: string[];

    try {
      schemaPaths = getGraphQLSchemaPaths(this.config);
    } catch (error) {
      this.emit('error', error);
      return;
    }

    const update = async (filePath: string) => {
      try {
        await this.updateDocumentForFile(filePath);
      } catch (error) {
        this.emit('error', error);
        return;
      }

      await this.generateDocumentTypes();
    };

    if (watchGlobs) {
      const documentWatcher = watch(globs);
      documentWatcher.on('ready', () => {
        documentWatcher.on('add', update);
        documentWatcher.on('change', update);
        documentWatcher.on('unlink', async (filePath: string) => {
          this.removeDocumentForFile(filePath);
          await this.generateDocumentTypes();
        });
      });

      const schemaWatcher = watch(schemaPaths);
      schemaWatcher.on('ready', () => {
        schemaWatcher.on('change', async (schemaPath: string) => {
          try {
            this.emit('start:schema');
            await this.updateSchemaAndGenerateTypes(schemaPath);
            this.emit('end:schema');

            await this.generateDocumentTypes();
          } catch (error) {
            // intentional noop
          }
        });
      });
    }

    try {
      this.emit('start:schema');
      await Promise.all(
        schemaPaths.map(this.updateSchemaAndGenerateTypes.bind(this)),
      );
      this.emit('end:schema');
    } catch (error) {
      this.emit('error', error);
      return;
    }

    try {
      await Promise.all(
        globs
          .map((pattern) => glob.sync(pattern))
          .reduce((patterns, globbed) => patterns.concat(globbed), [])
          .map(this.updateDocumentForFile.bind(this)),
      );
    } catch (error) {
      this.emit('error', error);
      return;
    }

    await this.generateDocumentTypes();
  }

  private async generateSchemaTypes(schemaPath: string, schema: GraphQLSchema) {
    const schemaTypesPath = getSchemaTypesPath(
      getGraphQLProjectForSchemaPath(this.config, schemaPath),
      this.options,
    );
    const definition = printSchema(schema, this.options);
    await mkdirp(dirname(schemaTypesPath));
    await writeFile(schemaTypesPath, definition);
    this.emit('build:schema', {
      schemaPath,
      schemaTypesPath,
    });
  }

  private async generateDocumentTypes() {
    this.emit('start:docs');

    getDuplicateOperations(this.documentMapByProject).forEach(
      ({projectName, duplicates}) => {
        if (duplicates.length) {
          duplicates.forEach(({operationName, filePaths}) => {
            const message = `GraphQL operations must have a unique name. The operation ${chalk.bold(
              operationName,
            )} is declared in:\n ${filePaths.sort().join('\n ')}${
              projectName ? ` (${chalk.bold(projectName)})` : ''
            }`;

            this.emit('error', new Error(message));
          });
        }
      },
    );

    await Promise.all(
      Array.from(this.documentMapByProject.entries()).map(
        ([projectName, documents]) => {
          return this.generateDocumentTypesForProject(
            this.config.getProjectConfig(projectName),
            documents,
          );
        },
      ),
    );

    this.emit('end:docs');
  }

  private async generateDocumentTypesForProject(
    project: GraphQLProjectConfig,
    documents: Map<string, DocumentNode>,
  ) {
    let ast: AST;

    try {
      const schema = project.getSchema();

      ast = compile(schema, concatAST(Array.from(documents.values())));
    } catch (error) {
      this.emit('error', error);
      return;
    }

    const fileMap = groupOperationsAndFragmentsByFile(ast);

    try {
      const buildResults = await Promise.all(
        Array.from(fileMap.values()).map((file) => {
          return this.writeDocumentFile(file, ast, project);
        }),
      );

      for (const buildResult of buildResults) {
        this.emit('build:docs', buildResult);
      }
    } catch (error) {
      // intentional noop
    }
  }

  private async writeDocumentFile(
    file: File,
    ast: AST,
    project: GraphQLProjectConfig,
  ) {
    const definitionPath = `${file.path}.d.ts`;
    const definition = this.getDocumentDefinition(file, ast, project);

    await writeFile(definitionPath, definition);

    return {
      documentPath: file.path,
      definitionPath,
      operation: file.operation,
      fragments: file.fragments,
    };
  }

  private getDocumentDefinition(
    file: File,
    ast: AST,
    project: GraphQLProjectConfig,
  ) {
    try {
      return printDocument(file, ast, {
        ...this.options,
        schemaTypesPath: getSchemaTypesPath(project, this.options),
      });
    } catch ({message}) {
      const error = new Error(
        `Error in ${file.path}: ${message[0].toLowerCase()}${message.slice(1)}`,
      );
      this.emit('error', error);
      throw error;
    }
  }

  private async updateSchemaAndGenerateTypes(schemaPath: string) {
    const schema = await this.updateSchema(schemaPath);
    await this.generateSchemaTypes(schemaPath, schema);
  }

  private async updateSchema(schemaPath: string) {
    try {
      const schemaJSON = await readJSON(schemaPath);
      return buildClientSchema(schemaJSON.data);
    } catch (error) {
      const parseError = new Error(
        `Error parsing '${schemaPath}':\n\n${error.message.replace(
          /Syntax Error GraphQL \(.*?\) /,
          '',
        )}`,
      );
      throw parseError;
    }
  }

  private async updateDocumentForFile(filePath: string) {
    const project = this.config.getConfigForFile(filePath);

    if (!project) {
      throw new Error(`No project found for file: ${filePath}`);
    }

    let documents = this.documentMapByProject.get(project.projectName);

    if (!documents) {
      documents = new Map<string, DocumentNode>();
      this.documentMapByProject.set(project.projectName, documents);
    }

    const contents = await readFile(filePath, 'utf8');

    if (contents.trim().length === 0) {
      return undefined;
    }

    const document = parse(new Source(contents, filePath));
    documents.set(filePath, document);

    return document;
  }

  private getProjects() {
    return getGraphQLProjects(this.config);
  }

  private getGlobs() {
    return this.getProjects().reduce<string[]>((globs, project) => {
      return globs.concat(
        project.includes.map((filePath) =>
          getGraphQLFilePath(this.config, filePath),
        ),
      );
    }, []);
  }

  private removeDocumentForFile(filePath: string) {
    const project = this.config.getConfigForFile(filePath);

    if (project) {
      const documents = this.documentMapByProject.get(project.projectName);

      if (documents) {
        documents.delete(filePath);
      }
    }
  }
}

function getSchemaTypesPath(project: GraphQLProjectConfig, options: Options) {
  if (typeof project.extensions.schemaTypesPath === 'string') {
    return getGraphQLFilePath(project, project.extensions.schemaTypesPath);
  }

  return getGraphQLFilePath(
    project,
    resolve(
      options.schemaTypesPath,
      `${project.projectName ? `${project.projectName}-` : ''}types.ts`,
    ),
  );
}

interface File {
  path: string;
  operation?: Operation;
  fragments: Fragment[];
}

function groupOperationsAndFragmentsByFile({operations, fragments}: AST) {
  return (Object.values(operations) as Array<Operation | Fragment>)
    .concat(Object.values(fragments))
    .reduce((map, item) => {
      if (!item.filePath) {
        return map;
      }

      let file = map.get(item.filePath);

      if (!file) {
        file = {
          path: item.filePath,
          operation: undefined,
          fragments: [],
        };

        map.set(item.filePath, file);
      }

      if (isOperation(item)) {
        file.operation = item;
      } else {
        file.fragments.push(item);
      }

      return map;
    }, new Map<string, File>());
}

function getDuplicateOperations(
  documentsMapByProject: GraphQLDocumentMapByProject,
) {
  return Array.from(documentsMapByProject.entries()).map(
    ([projectName, documents]) => {
      return {
        projectName,
        duplicates: getDuplicateProjectOperations(documents),
      };
    },
  );
}

function getDuplicateProjectOperations(documents: Map<string, DocumentNode>) {
  const operations = new Map<string, Set<string>>();

  Array.from(documents.entries()).forEach(([filePath, document]) => {
    document.definitions.filter(isOperationDefinition).forEach((definition) => {
      const {name} = definition;
      if (name && name.value) {
        const map = operations.get(name.value);
        if (map) {
          map.add(filePath);
        } else {
          operations.set(name.value, new Set([filePath]));
        }
      }
    });
  });

  return Array.from(operations.entries())
    .filter(([, filePaths]) => filePaths.size > 1)
    .map(([operationName, filePath]) => {
      return {operationName, filePaths: Array.from(filePath)};
    });
}

function isOperationDefinition(
  definition: DefinitionNode,
): definition is OperationDefinitionNode {
  return definition.kind === 'OperationDefinition';
}
