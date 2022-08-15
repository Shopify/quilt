import type {GraphQLConfig, GraphQLProjectConfig} from 'graphql-config';

const getSchemaPathsForProject = (
  project: GraphQLProjectConfig,
  config: GraphQLConfig,
) =>
  config.extensions.loaders.schema
    .loadTypeDefsSync(project.schema)
    .map((source) => source.location)
    .filter((schemaPath): schemaPath is string => schemaPath != null);

const getSchemaPaths = (config: GraphQLConfig) =>
  Object.values(config.projects)
    .map((project) => getSchemaPathsForProject(project, config))
    .flat();

export default getSchemaPaths;

export {getSchemaPathsForProject};
