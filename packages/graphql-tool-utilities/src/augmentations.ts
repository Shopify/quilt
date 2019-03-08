import {GraphQLProjectConfig} from 'graphql-config/lib/GraphQLProjectConfig';
import {
  resolvePathRelativeToConfig,
  resolveProjectName,
  resolveSchemaPath,
} from './utilities';

declare module 'graphql-config/lib/GraphQLProjectConfig' {
  /* eslint-disable lines-around-comment */
  interface GraphQLProjectConfig {
    /**
     * @deprecated use the utility function by the same name instead
     */
    resolvePathRelativeToConfig(relativePath: string): string;
    /**
     * @deprecated use the utility function by the same name instead
     */
    resolveProjectName(defaultName?: string): string;
    /**
     * @deprecated use the utility function by the same name instead
     */
    resolveSchemaPath(ignoreMissing?: boolean): string;
  }
  /* eslint-enable lines-around-comment */
}

function resolvePathRelativeToConfigAugmentation(
  this: GraphQLProjectConfig,
  relativePath: string,
) {
  return resolvePathRelativeToConfig(this, relativePath);
}

function resolveProjectNameAugmentation(
  this: GraphQLProjectConfig,
  defaultName?: string,
) {
  return resolveProjectName(this, defaultName);
}

function resolveSchemaPathAugmentation(
  this: GraphQLProjectConfig,
  ignoreMissing?: boolean,
) {
  return resolveSchemaPath(this, ignoreMissing);
}

GraphQLProjectConfig.prototype.resolvePathRelativeToConfig = resolvePathRelativeToConfigAugmentation;
GraphQLProjectConfig.prototype.resolveProjectName = resolveProjectNameAugmentation;
GraphQLProjectConfig.prototype.resolveSchemaPath = resolveSchemaPathAugmentation;
