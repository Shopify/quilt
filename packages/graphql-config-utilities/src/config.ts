import {existsSync} from 'fs';
import {promisify} from 'util';
import {resolve} from 'path';

import {GraphQLConfig, GraphQLProjectConfig} from 'graphql-config';
// we need to use an import/require here because it does not force consumers to
// enable esModuleInterop in tsconfig.json
import glob from 'glob';

export const defaultGraphQLProjectName = 'GraphQL';

// temporary utility until `graphql-config` supports this function natively
// see: https://github.com/prisma/graphql-config/pull/113
export function resolvePathRelativeToConfig(
  project: GraphQLProjectConfig,
  relativePath: string,
) {
  return resolve(project.dirpath, relativePath);
}

export function resolveProjectName(
  project: GraphQLProjectConfig,
  defaultName = defaultGraphQLProjectName,
) {
  // eslint-disable-next-line no-console
  console.warn(
    'Deprecation: Use of `resolveProjectName` has been deprecated. Please use `project.name` instead.',
  );
  return project.name || defaultName;
}

export function resolveSchemaPath(
  project: GraphQLProjectConfig,
  ignoreMissing = false,
) {
  // schemaPath is nullable in graphql-config even though it cannot actually be
  // omitted. This function simplifies access to the schema without
  // requiring a type guard.
  if (!project.schema) {
    // this case should never happen with a properly formatted config file.
    // graphql-config currently does not perform any validation so it's possible
    // for a mal-formed schema to be loaded at runtime.
    throw new Error(`Missing GraphQL schema for project '${project.name}'`);
  }

  // resolve fully qualified schemaPath
  const schemaPath = resolve(project.dirpath, project.schema as string);
  if (ignoreMissing) {
    return schemaPath;
  }

  if (!existsSync(schemaPath)) {
    const forProject = project.name ? ` for project '${project.name}'` : '';
    throw new Error(
      [
        `Schema not found${forProject}.`,
        `Expected to find the schema at '${schemaPath}' but the path does not exist.`,
        `Check '${project.filepath}' and verify that schemaPath is configured correctly${forProject}.`,
      ].join(' '),
    );
  }

  return schemaPath;
}

export function getGraphQLProjects(config: GraphQLConfig) {
  // eslint-disable-next-line no-console
  console.warn(
    'Deprecation: Use of `getGraphQLProjects` has been deprecated. Please use `config.projects` instead.',
  );

  const projects = Object.values(config?.projects || {});

  if (projects.length > 1) {
    // multi-project configuration, return an array of projects
    return projects;
  }

  if (projects[0] && projects[0]?.schema) {
    // single project configuration, return an array of the single project
    return projects;
  }

  // invalid project configuration
  throw new Error(`No projects defined in '${config.filepath}'`);
}

export function getGraphQLSchemaPaths(config: GraphQLConfig) {
  return getGraphQLProjects(config).reduce<string[]>((schemas, project) => {
    return schemas.concat(resolveSchemaPath(project));
  }, []);
}

export async function getGraphQLProjectIncludedFilePaths(
  projectConfig: GraphQLProjectConfig,
) {
  const [includes, excludes] = getIncludesExcludesFromConfig(projectConfig);
  return (
    await Promise.all(
      includes.map(include =>
        promisify(glob)(resolvePathRelativeToConfig(projectConfig, include), {
          ignore: excludes.map(exclude =>
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
      .filter(project => {
        return resolveSchemaPath(project, true) === schemaPath;
      })
      .shift() || config.projects[0];

  if (
    !project ||
    !(project as GraphQLProjectConfig).schema ||
    `${(project as GraphQLProjectConfig).dirpath}/${
      (project as GraphQLProjectConfig).schema
    }` !== schemaPath
  ) {
    throw new Error(
      `No project defined in graphql config for schema '${schemaPath}'`,
    );
  }
  return project;
}

export function getIncludesExcludesFromConfig(
  projectConfig: GraphQLProjectConfig,
): [string[], string[]] {
  if (!projectConfig.include) {
    return [[], []];
  }

  const excludes = projectConfig.exclude || [];

  const includes =
    typeof projectConfig.include === 'string'
      ? [projectConfig.include as string]
      : projectConfig.include;
  const ignore = typeof excludes === 'string' ? [excludes as string] : excludes;
  return [includes, ignore];
}
