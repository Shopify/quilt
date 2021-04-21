import './polyfills';
import {EventEmitter} from 'events';
import {join, resolve} from 'path';

import {
  DocumentNode,
  DefinitionNode,
  FragmentDefinitionNode,
  OperationDefinitionNode,
  parse,
  Source,
  concatAST,
} from 'graphql';
import chalk from 'chalk';
import {mkdirp, readFile, writeFile} from 'fs-extra';
import {
  getGraphQLConfig,
  GraphQLProjectConfig,
  GraphQLConfig,
} from 'graphql-config';
import {
  getGraphQLProjectForSchemaPath,
  getGraphQLProjects,
  getGraphQLSchemaPaths,
  resolvePathRelativeToConfig,
} from 'graphql-config-utilities';
import {
  AST,
  compile,
  Fragment,
  isOperation,
  Operation,
} from 'graphql-tool-utilities';

import type {GraphQLFilesystem} from './filesystem';
import {AbstractGraphQLFilesystem} from './filesystem';
import {
  printDocument,
  generateSchemaTypes,
  PrintDocumentOptions,
  PrintSchemaOptions,
} from './print';
import {EnumFormat, ExportFormat} from './types';

export type {GraphQLFilesystem};
export {AbstractGraphQLFilesystem, EnumFormat, ExportFormat};

export interface Options extends PrintDocumentOptions, PrintSchemaOptions {
  addTypename: boolean;
  schemaTypesPath: string;
  config?: GraphQLConfig;
  getProjectFilePaths?: (
    projectConfig: GraphQLProjectConfig,
  ) => Promise<string[]>;
}

export interface BuilderOptions extends Options {
  cwd?: string;
}

export interface RunOptions {
  watch?: boolean;
  graphQLFilesystem?: GraphQLFilesystem | undefined;
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
  private readonly options: Options;
  // workspace graphql configuration
  // see: https://github.com/prisma/graphql-config
  private readonly config: GraphQLConfig;
  // projectName -> {filePath -> document}
  // NOTE: projectName can be undefined for nameless graphql-config projects
  private readonly documentMapByProject: GraphQLDocumentMapByProject = new Map<
    string | undefined,
    Map<string, DocumentNode>
  >();

  private filesystem: GraphQLFilesystem | undefined;

  constructor({cwd, ...options}: BuilderOptions) {
    super();
    this.options = options;

    this.config = options.config
      ? options.config
      : getGraphQLConfig(cwd ? resolve(cwd) : undefined);
  }

  once(event: 'error', handler: (error: Error) => void): this;
  once(event: 'build:docs', handler: (built: DocumentBuild) => void): this;
  once(event: 'build:schema', handler: (built: SchemaBuild) => void): this;
  once(
    event: 'start:docs' | 'end:docs' | 'start:schema' | 'end:schema',
    handler: () => void,
  ): this;

  once(event: string, handler: (...args: any[]) => void): this {
    return super.once(event, handler);
  }

  on(event: 'error', handler: (error: Error) => void): this;
  on(event: 'build:docs', handler: (built: DocumentBuild) => void): this;
  on(event: 'build:schema', handler: (built: SchemaBuild) => void): this;
  on(
    event: 'start:docs' | 'end:docs' | 'start:schema' | 'end:schema',
    handler: () => void,
  ): this;

  on(event: string, handler: (...args: any[]) => void): this {
    return super.on(event, handler);
  }

  emit(event: 'error', error: Error): boolean;
  emit(event: 'build:docs', built: DocumentBuild): boolean;
  emit(event: 'build:schema', built: SchemaBuild): boolean;
  emit(
    event: 'start:docs' | 'end:docs' | 'start:schema' | 'end:schema',
  ): boolean;

  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  async run({watch: watchGlobs = false, graphQLFilesystem}: RunOptions = {}) {
    let schemaPaths: string[];

    try {
      schemaPaths = getGraphQLSchemaPaths(this.config);
    } catch (error) {
      this.emit('error', error);
      return;
    }

    const filesystem = graphQLFilesystem ?? (await defaultFilesytem());
    this.filesystem = filesystem;

    if (watchGlobs) {
      filesystem
        .on('change:document', this.handleDocumentUpdate)
        .on('delete:document', this.handleDocumentDelete)
        .on('change:schema', this.handleSchemaUpdate);

      // wait for all watchers to be ready
      await filesystem.watch(this.config);
    }

    try {
      this.emit('start:schema');
      await Promise.all(
        schemaPaths.map(schemaPath => this.generateSchemaTypes(schemaPath)),
      );
      this.emit('end:schema');
    } catch (error) {
      this.emit('error', error);
      return;
    }

    try {
      await Promise.all(
        getGraphQLProjects(this.config).map(projectConfig =>
          this.updateDocumentsForProject(filesystem, projectConfig),
        ),
      );
    } catch (error) {
      this.emit('error', error);
      return;
    }

    await this.generateDocumentTypes();
  }

  stop() {
    this.filesystem?.dispose();
  }

  private handleDocumentUpdate = async (
    filePath: string,
    projectConfig: GraphQLProjectConfig,
  ) => {
    try {
      await this.updateDocumentForFile(filePath, projectConfig);
    } catch (error) {
      this.emit('error', error);
      return;
    }

    await this.generateDocumentTypes();
  };

  private handleDocumentDelete = async (
    filePath: string,
    projectConfig: GraphQLProjectConfig,
  ) => {
    const documents = this.documentMapByProject.get(projectConfig.projectName);

    if (documents) {
      documents.delete(filePath);
    }

    await this.generateDocumentTypes();
  };

  private handleSchemaUpdate = async (schemaPath: string) => {
    try {
      this.emit('start:schema');
      await this.generateSchemaTypes(schemaPath);
      this.emit('end:schema');

      await this.generateDocumentTypes();
    } catch (error) {
      // intentional noop
    }
  };

  private async generateSchemaTypes(schemaPath: string) {
    const projectConfig = getGraphQLProjectForSchemaPath(
      this.config,
      schemaPath,
    );

    const schemaTypesPath = getSchemaTypesPath(projectConfig, this.options);
    const definitions = generateSchemaTypes(
      projectConfig.getSchema(),
      this.options,
    );
    await mkdirp(schemaTypesPath);
    await Promise.all(
      Array.from(definitions.entries()).map(([fileName, definition]) =>
        writeFile(join(schemaTypesPath, fileName), definition),
      ),
    );
    this.emit('build:schema', {
      schemaPath,
      schemaTypesPath,
    });
  }

  private async generateDocumentTypes() {
    this.emit('start:docs');

    this.checkForDuplicateOperations();
    this.checkForDuplicateFragments();

    await Promise.all(
      Array.from(
        this.documentMapByProject.entries(),
      ).map(([projectName, documents]) =>
        this.generateDocumentTypesForProject(
          this.config.getProjectConfig(projectName),
          documents,
        ),
      ),
    );

    this.emit('end:docs');
  }

  private checkForDuplicateOperations() {
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
  }

  private checkForDuplicateFragments() {
    getDuplicateFragments(this.documentMapByProject).forEach(
      ({projectName, duplicates}) => {
        if (duplicates.length) {
          duplicates.forEach(({fragmentName, filePaths}) => {
            const message = `GraphQL fragments must have a unique name. The fragment ${chalk.bold(
              fragmentName,
            )} is declared in:\n ${filePaths.sort().join('\n ')}${
              projectName ? ` (${chalk.bold(projectName)})` : ''
            }`;

            this.emit('error', new Error(message));
          });
        }
      },
    );
  }

  private async generateDocumentTypesForProject(
    projectConfig: GraphQLProjectConfig,
    documents: Map<string, DocumentNode>,
  ) {
    let ast: AST;

    try {
      ast = compile(
        projectConfig.getSchema(),
        concatAST(Array.from(documents.values())),
      );
    } catch (error) {
      this.emit('error', error);
      return;
    }

    try {
      await Promise.all(
        Array.from(groupOperationsAndFragmentsByFile(ast).values()).map(file =>
          this.writeDocumentFile(file, ast, projectConfig),
        ),
      );
    } catch (error) {
      // intentional noop
    }
  }

  private async writeDocumentFile(
    file: File,
    ast: AST,
    projectConfig: GraphQLProjectConfig,
  ) {
    const definitionPath = `${file.path}.d.ts`;

    await writeFile(
      definitionPath,
      this.getDocumentDefinition(file, ast, projectConfig),
    );

    this.emit('build:docs', {
      documentPath: file.path,
      definitionPath,
      operation: file.operation,
      fragments: file.fragments,
    });
  }

  private getDocumentDefinition(
    file: File,
    ast: AST,
    projectConfig: GraphQLProjectConfig,
  ) {
    try {
      return printDocument(file, ast, {
        enumFormat: this.options.enumFormat,
        exportFormat: this.options.exportFormat,
        addTypename: this.options.addTypename,
        schemaTypesPath: getSchemaTypesPath(projectConfig, this.options),
      });
    } catch ({message}) {
      const error = new Error(
        `Error in ${file.path}: ${message[0].toLowerCase()}${message.slice(1)}`,
      );
      this.emit('error', error);
      throw error;
    }
  }

  private async updateDocumentsForProject(
    filesystem: GraphQLFilesystem,
    projectConfig: GraphQLProjectConfig,
  ) {
    const filePaths = await filesystem.getGraphQLProjectIncludedFilePaths(
      projectConfig,
    );

    return Promise.all(
      filePaths.map(filePath =>
        this.updateDocumentForFile(filePath, projectConfig),
      ),
    );
  }

  private async updateDocumentForFile(
    filePath: string,
    projectConfig: GraphQLProjectConfig,
  ) {
    const contents = await readFile(filePath, 'utf8');

    return this.setDocumentForFilePath(filePath, projectConfig, contents);
  }

  private setDocumentForFilePath(
    filePath: string,
    projectConfig: GraphQLProjectConfig,
    contents: string,
  ) {
    let documents = this.documentMapByProject.get(projectConfig.projectName);

    if (!documents) {
      documents = new Map<string, DocumentNode>();
      this.documentMapByProject.set(projectConfig.projectName, documents);
    }

    if (contents.trim().length === 0) {
      return undefined;
    }

    const document = parse(new Source(contents, filePath));
    documents.set(filePath, document);

    return document;
  }
}

function getSchemaTypesPath(
  projectConfig: GraphQLProjectConfig,
  options: Options,
) {
  if (typeof projectConfig.extensions.schemaTypesPath === 'string') {
    return resolvePathRelativeToConfig(
      projectConfig,
      projectConfig.extensions.schemaTypesPath,
    );
  }

  return resolvePathRelativeToConfig(
    projectConfig,
    join(
      options.schemaTypesPath,
      `${
        projectConfig.projectName ? `${projectConfig.projectName}-` : ''
      }types`,
    ),
  );
}

async function defaultFilesytem() {
  const {DefaultGraphQLFilesystem} = await import(
    './filesystem/default-graphql-filesystem'
  );
  return new DefaultGraphQLFilesystem();
}

interface File {
  path: string;
  operation?: Operation;
  fragments: Fragment[];
}

function groupOperationsAndFragmentsByFile({operations, fragments}: AST) {
  return (Object.values(operations) as (Operation | Fragment)[])
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

function getDuplicateFragments(
  documentsMapByProject: GraphQLDocumentMapByProject,
) {
  return Array.from(documentsMapByProject.entries()).map(
    ([projectName, documents]) => {
      return {
        projectName,
        duplicates: getDuplicateProjectFragments(documents),
      };
    },
  );
}

function getDuplicateProjectOperations(documents: Map<string, DocumentNode>) {
  const operations = new Map<string, Set<string>>();

  Array.from(documents.entries()).forEach(([filePath, document]) => {
    document.definitions.filter(isOperationDefinition).forEach(definition => {
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

function getDuplicateProjectFragments(documents: Map<string, DocumentNode>) {
  const fragments = new Map<string, Set<string>>();

  Array.from(documents.entries()).forEach(([filePath, document]) => {
    document.definitions.filter(isFragmentDefinition).forEach(definition => {
      const {name} = definition;
      if (name && name.value) {
        const map = fragments.get(name.value);
        if (map) {
          map.add(filePath);
        } else {
          fragments.set(name.value, new Set([filePath]));
        }
      }
    });
  });

  return Array.from(fragments.entries())
    .filter(([, filePaths]) => filePaths.size > 1)
    .map(([fragmentName, filePath]) => {
      return {fragmentName, filePaths: Array.from(filePath)};
    });
}

function isOperationDefinition(
  definition: DefinitionNode,
): definition is OperationDefinitionNode {
  return definition.kind === 'OperationDefinition';
}

function isFragmentDefinition(
  definition: DefinitionNode,
): definition is FragmentDefinitionNode {
  return definition.kind === 'FragmentDefinition';
}
