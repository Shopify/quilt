import {GraphQLProjectConfig} from 'graphql-config/lib/GraphQLProjectConfig';

declare module 'graphql-config/lib/GraphQLProjectConfig' {
  interface GraphQLProjectConfig {
    resolveProjectName(defaultName?: string): string;
  }
}

function resolveProjectName(
  this: GraphQLProjectConfig,
  defaultName = 'GraphQL',
) {
  return this.projectName || defaultName;
}

GraphQLProjectConfig.prototype.resolveProjectName = resolveProjectName;
