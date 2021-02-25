import {existsSync} from 'fs';
import {promisify} from 'util';

import {GraphQLConfig, GraphQLProjectConfig} from 'graphql-config';

// we need to use an import/require here because it does not force consumers to
// enable esModuleInterop in tsconfig.json
import glob = require('glob');

export const defaultGraphQLProjectName = 'GraphQL';

// temporary utility until `graphql-config` supports this function natively
// see: https://github.com/prisma/graphql-config/pull/113
export function resolvePathRelativeToConfig(
  project: GraphQLProjectConfig,
  relativePath: string,
) {
  return project.resolveConfigPath(relativePath);
}

export function resolveProjectName(
  project: GraphQLProjectConfig,
  defaultName = defaultGraphQLProjectName,
) {
  return project.projectName || defaultName;
}

export function resolveSchemaPath(
  project: GraphQLProjectConfig,
  ignoreMissing = false,
) {
  // schemaPath is nullable in graphq-config even though it cannot actually be
  // omitted. This function simplifies access to the schemaPath without
  // requiring a type guard.
  if (!project.schemaPath) {
    // this case should never happen with a properly formatted config file.
    // graphql-config currently does not perform any validation so it's possible
    // for a mal-formed schema to be loaded at runtime.
    throw new Error(
      `Missing GraphQL schemaPath for project '${resolveProjectName(project)}'`,
    );
  }

  // resolve fully qualified schemaPath
  const schemaPath = project.resolveConfigPath(project.schemaPath);

  if (ignoreMissing) {
    return schemaPath;
  }

  if (!existsSync(schemaPath)) {
    const forProject = project.projectName
      ? ` for project '${project.projectName}'`
      : '';
    throw new Error(
      [
        `Schema not found${forProject}.`,
        `Expected to find the schema at '${schemaPath}' but the path does not exist.`,
        `Check '${project.configPath}' and verify that schemaPath is configured correctly${forProject}.`,
      ].join(' '),
    );
  }

  return schemaPath;
}

export function getGraphQLProjects(config: GraphQLConfig) {
  const projects = config.getProjects();

  if (projects) {
    // multi-project configuration, return an array of projects
    return Object.values(projects);
  }

  const project = config.getProjectConfig();

  if (project && project.schemaPath) {
    // single project configuration, return an array of the single project
    return [project];
  }

  // invalid project configuration
  throw new Error(`No projects defined in '${config.configPath}'`);
}

export function getGraphQLSchemaPaths(config: GraphQLConfig) {
  return getGraphQLProjects(config).reduce<string[]>((schemas, project) => {
    return schemas.concat(resolveSchemaPath(project));
  }, []);
}

export async function getGraphQLProjectIncludedFilePaths(
  projectConfig: GraphQLProjectConfig,
) {
  return (
    await Promise.all(
      projectConfig.includes.map((include) =>
        promisify(glob)(resolvePathRelativeToConfig(projectConfig, include), {
          ignore: projectConfig.excludes.map((exclude) =>
            resolvePathRelativeToConfig(projectConfig, exclude),
          ),
        }),
      ),
    )
  ).reduce((allFilePaths, filePaths) => allFilePaths.concat(filePaths), []);
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
