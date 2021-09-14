import {EventEmitter} from 'events';

import {GraphQLProjectConfig, GraphQLConfig} from 'graphql-config';

export interface GraphQLFilesystem {
  watch(config: GraphQLConfig): Promise<void>;
  dispose(): void;

  getGraphQLProjectIncludedFilePaths(
    projectConfig: GraphQLProjectConfig,
  ): Promise<string[]>;

  once(event: 'error', handler: (error: Error) => void): this;
  once(event: 'change:schema', handler: (path: string) => void): this;
  once(
    event: 'change:document' | 'delete:document',
    handler: (path: string, project: GraphQLProjectConfig) => void,
  ): this;

  on(event: 'error', handler: (error: Error) => void): this;
  on(event: 'change:schema', handler: (path: string) => void): this;
  on(
    event: 'change:document' | 'delete:document',
    handler: (path: string, project: GraphQLProjectConfig) => void,
  ): this;
}

export abstract class AbstractGraphQLFilesystem extends EventEmitter {
  abstract watch(config: GraphQLConfig): Promise<void>;
  abstract dispose(): void;

  abstract getGraphQLProjectIncludedFilePaths(
    projectConfig: GraphQLProjectConfig,
  ): Promise<string[]>;

  once(event: 'error', handler: (error: Error) => void): this;
  once(event: 'change:schema', handler: (path: string) => void): this;
  once(
    event: 'change:document' | 'delete:document',
    handler: (path: string, project: GraphQLProjectConfig) => void,
  ): this;

  once(event: string, handler: (...args: any[]) => void): this {
    return super.once(event, handler);
  }

  on(event: 'error', handler: (error: Error) => void): this;
  on(event: 'change:schema', handler: (path: string) => void): this;
  on(
    event: 'change:document' | 'delete:document',
    handler: (path: string, project: GraphQLProjectConfig) => void,
  ): this;

  on(event: string, handler: (...args: any[]) => void): this {
    return super.on(event, handler);
  }

  emit(event: 'error', error: Error): boolean;
  emit(
    event: 'change:document' | 'delete:document',
    path: string,
    config: GraphQLProjectConfig,
  ): boolean;

  emit(event: 'change:schema', input: string | string[]): boolean;
  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }
}
