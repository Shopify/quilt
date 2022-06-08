import {parse as graphQLParse, Source, ParseOptions} from 'graphql';
import {DocumentNode as BaseDocumentNode} from 'graphql/language/ast';

export interface GraphQLOperation<Data = {}, Variables = {}, DeepPartial = {}> {
  // We need something to actually use the types, otherwise TypeScript
  // "discards" them for inference on extending interfaces.
  readonly __typeData?: Data;
  readonly __typeVariables?: Variables;
  readonly __typeDeepPartial?: DeepPartial;
}

export interface DocumentNode<Data = {}, Variables = {}, DeepPartial = {}>
  extends BaseDocumentNode,
    GraphQLOperation<Data, Variables, DeepPartial> {
  readonly id: string;
}

export interface SimpleDocument<Data = {}, Variables = {}, DeepPartial = {}>
  extends GraphQLOperation<Data, Variables, DeepPartial> {
  readonly id: string;
  readonly name?: string;
  readonly source: string;
}

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
) => DocumentNode<Data, Variables, DeepPartial> = graphQLParse as any;
