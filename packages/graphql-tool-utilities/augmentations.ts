import {existsSync} from 'fs';
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

  // resolve fully qualified schemaPath
  const schemaPath = this.resolveConfigPath(this.schemaPath);

  if (!existsSync(schemaPath)) {
    const forProject = this.projectName
      ? ` for project '${this.projectName}'`
      : '';
    throw new Error(
      [
        `Schema not found${forProject}.`,
        `Expected to find the schema at '${schemaPath}' but the path does not exist.`,
        `Check '${
          this.configPath
        }' and verify that schemaPath is configured correctly${forProject}.`,
      ].join(' '),
    );
  }

  return schemaPath;
}

GraphQLProjectConfig.prototype.resolveProjectName = resolveProjectName;
GraphQLProjectConfig.prototype.resolveSchemaPath = resolveSchemaPath;
