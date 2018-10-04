import {GraphQLProjectConfig} from 'graphql-config/lib/GraphQLProjectConfig';

declare module 'graphql-config/lib/GraphQLProjectConfig' {
  interface GraphQLProjectConfig {
    resolveProjectName(defaultName?: string): string;
    resolveSchemaPath(): string;
  }
}

function resolveProjectName(
  this: GraphQLProjectConfig,
  defaultName = 'GraphQL',
) {
  return this.projectName || defaultName;
}

function resolveSchemaPath(this: GraphQLProjectConfig) {
  // schemaPath is nullable in graphq-config even though it cannot actually be
  // omitted. This function simplifies access ot the schemaPath without
  // requiring a type guard.
  if (!this.schemaPath) {
    // this case should never happen with a properly formatted config file.
    // graphql-config currently does not perform any validation so it's possible
    // for a mal-formed schema to be loaded at runtime.
    throw new Error(
      `Missing GraphQL schemaPath for project '${this.resolveProjectName()}'`,
    );
  }

  return this.schemaPath;
}

GraphQLProjectConfig.prototype.resolveProjectName = resolveProjectName;
GraphQLProjectConfig.prototype.resolveSchemaPath = resolveSchemaPath;
