import glob from 'glob';
import {GraphQLConfig, GraphQLProjectConfig} from 'graphql-config';
import {isAbsolute, resolve} from 'path';
import {promisify} from 'util';

import './augmentations';

export function getGraphQLProjects(config: GraphQLConfig) {
  const projects = config.getProjects();

  if (projects) {
    // multi-project configuration, return an array of projects
    return Object.values(projects);
  }

  const project = config.getProjectConfig();

  if (project) {
    // single project configuration, return an array of the single project
    return [project];
  }

  // invalid project configuration
  throw new Error(`No projects defined in '${config.configPath}'`);
}

export function getGraphQLSchemaPaths(config: GraphQLConfig) {
  return getGraphQLProjects(config).reduce<string[]>((schemas, project) => {
    return schemas.concat(project.resolveSchemaPath());
  }, []);
}

export async function getGraphQLProjectIncludedFilePaths(
  projectConfig: GraphQLProjectConfig,
) {
  return (await Promise.all(
    projectConfig.includes.map((include) =>
      promisify(glob)(getGraphQLFilePath(projectConfig, include), {
        ignore: projectConfig.excludes.map((exclude) =>
          getGraphQLFilePath(projectConfig, exclude),
        ),
      }),
    ),
  )).flatMap((filePaths) => filePaths);
}

export function getGraphQLProjectForSchemaPath(
  config: GraphQLConfig,
  schemaPath: string,
) {
  const project =
    getGraphQLProjects(config)
      .filter((project) => project.schemaPath === schemaPath)
      .shift() || config.getProjectConfig();

  if (!project || project.schemaPath !== schemaPath) {
    throw new Error(
      `No project defined in graphql config for schema '${schemaPath}'`,
    );
  }

  return project;
}

export function getGraphQLFilePath(
  config: GraphQLConfig | GraphQLProjectConfig,
  filePath: string,
) {
  return isAbsolute(filePath) ? filePath : resolve(config.configDir, filePath);
}
