import {
  parse as graphQLParse,
  DocumentNode as BaseDocumentNode,
  Source,
  ParseOptions,
} from 'graphql';

// @ts-ignore
export interface GraphQLOperation<
  // @ts-ignore
  Data = {},
  // @ts-ignore
  Variables = {},
  // @ts-ignore
  DeepPartial = {}
> {}

export interface DocumentNode<Data = {}, Variables = {}, DeepPartial = {}>
  extends BaseDocumentNode,
    GraphQLOperation<Data, Variables, DeepPartial> {}

export type GraphQLData<T> = T extends GraphQLOperation<infer Data, any, any>
  ? Data
  : never;

export type GraphQLVariables<T> = T extends GraphQLOperation<
  any,
  infer Variables,
  any
>
  ? Variables
  : never;

export type GraphQLDeepPartial<T> = T extends GraphQLOperation<
  any,
  any,
  infer DeepPartial
>
  ? DeepPartial
  : never;

export const parse: <Data = {}, Variables = {}, DeepPartial = {}>(
  source: string | Source,
  options?: ParseOptions,
) => DocumentNode<Data, Variables, DeepPartial> = graphQLParse;
