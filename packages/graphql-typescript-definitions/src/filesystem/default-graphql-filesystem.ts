import {FSWatcher, watch} from 'chokidar';
import {GraphQLProjectConfig, GraphQLConfig} from 'graphql-config';
import {
  getGraphQLProjectIncludedFilePaths,
  getGraphQLProjects,
  getGraphQLSchemaPaths,
  resolvePathRelativeToConfig,
  getIncludesExcludesFromConfig,
} from 'graphql-config-utilities';

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

  getGraphQLProjectIncludedFilePaths(projectConfig: GraphQLProjectConfig) {
    return getGraphQLProjectIncludedFilePaths(projectConfig);
  }

  private setupDocumentWatchers(config: GraphQLConfig) {
    return getGraphQLProjects(config)
      .filter((projectConfig) => {
        const [includes] = getIncludesExcludesFromConfig(projectConfig);
        return includes.length > 0;
      })
      .map((projectConfig) => {
        const [includes, excludes] =
          getIncludesExcludesFromConfig(projectConfig);
        return watch(
          includes.map((include) =>
            resolvePathRelativeToConfig(projectConfig, include),
          ),
          {
            ignored: excludes.map((exclude) =>
              resolvePathRelativeToConfig(projectConfig, exclude),
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
    return watch(getGraphQLSchemaPaths(config), {
      ignoreInitial: true,
    }).on('change', (schemaPath) => this.emit('change:schema', schemaPath));
  }
}
