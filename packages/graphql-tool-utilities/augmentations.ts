import {existsSync} from 'fs';
import {GraphQLProjectConfig} from 'graphql-config/lib/GraphQLProjectConfig';

declare module 'graphql-config/lib/GraphQLProjectConfig' {
  interface GraphQLProjectConfig {
    resolvePathRelativeToConfig(relativePath: string): string;
    resolveProjectName(defaultName?: string): string;
    resolveSchemaPath(ignoreMissing?: boolean): string;
  }
}

// temporary augmentation until `graphql-config` supports this new function
// see: https://github.com/prisma/graphql-config/pull/113
function resolvePathRelativeToConfig(
  this: GraphQLProjectConfig,
  relativePath: string,
) {
  // this is just an alias to resolveConfigPath with a more meaningful name
  return this.resolveConfigPath(relativePath);
}

function resolveProjectName(
  this: GraphQLProjectConfig,
  defaultName = 'GraphQL',
) {
  return this.projectName || defaultName;
}

function resolveSchemaPath(this: GraphQLProjectConfig, ignoreMissing = false) {
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

  if (ignoreMissing) {
    return schemaPath;
  }

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

GraphQLProjectConfig.prototype.resolvePathRelativeToConfig = resolvePathRelativeToConfig;
GraphQLProjectConfig.prototype.resolveProjectName = resolveProjectName;
GraphQLProjectConfig.prototype.resolveSchemaPath = resolveSchemaPath;
