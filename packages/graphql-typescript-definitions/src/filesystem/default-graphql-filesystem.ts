import {resolve} from 'path';

import {FSWatcher, watch} from 'chokidar';
import {GraphQLConfig, GraphQLProjectConfig} from 'graphql-config';
import {
  getGraphQLProjectIncludedFilePaths,
  getIncludesExcludesFromConfig,
} from 'graphql-config-utilities';

import getSchemaPaths from '../util/get-schema-paths';

import {AbstractGraphQLFilesystem} from './graphql-filesystem';

export class DefaultGraphQLFilesystem extends AbstractGraphQLFilesystem {
  private readonly watchers: FSWatcher[] = [];

  async watch(config: GraphQLConfig) {
    this.watchers.push(
      ...this.setupDocumentWatchers(config).concat(
        this.setupSchemaWatcher(config),
      ),
    );

    await Promise.all(
      this.watchers.map(
        (watcher) =>
          new Promise<void>((resolve) => watcher.on('ready', () => resolve())),
      ),
    );
  }

  dispose() {
    this.watchers.forEach((watcher) => {
      watcher.close();
    });

    this.watchers.length = 0;
  }

  async getGraphQLProjectIncludedFilePaths(
    projectConfig: GraphQLProjectConfig,
  ) {
    if (projectConfig.isLegacy) {
      return getGraphQLProjectIncludedFilePaths(projectConfig);
    }

    const documents = await projectConfig.getDocuments();
    return documents
      .map((source) => source.location)
      .filter((path): path is string => path != null);
  }

  private setupDocumentWatchers(config: GraphQLConfig) {
    return Object.values(config.projects)
      .filter(
        (projectConfig) => projectConfig.include || projectConfig.documents,
      )
      .map((projectConfig) => {
        const {includes, excludes} = documentsForProject(projectConfig);

        return watch(
          includes.map((include) => resolve(projectConfig.dirpath, include)),
          {
            ignored: excludes.map((exclude) =>
              resolve(projectConfig.dirpath, exclude),
            ),
            ignoreInitial: true,
          },
        )
          .on('add', (filePath: string) =>
            this.emit('change:document', filePath, projectConfig),
          )
          .on('change', (filePath: string) =>
            this.emit('change:document', filePath, projectConfig),
          )
          .on('unlink', (filePath: string) =>
            this.emit('delete:document', filePath, projectConfig),
          );
      });
  }

  private setupSchemaWatcher(config: GraphQLConfig) {
    return watch(getSchemaPaths(config), {
      ignoreInitial: true,
    }).on('change', (schemaPath) => this.emit('change:schema', schemaPath));
  }
}

const documentsForProject = (
  projectConfig: GraphQLProjectConfig,
): {includes: string[]; excludes: string[]} => {
  if (projectConfig.isLegacy) {
    const [includes, excludes] = getIncludesExcludesFromConfig(projectConfig);

    return {includes, excludes};
  }

  const documents = projectConfig.documents ?? [];

  return {
    includes: Array.isArray(documents) ? documents : [documents],
    excludes: [],
  };
};
