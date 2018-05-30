import {
  parse as graphQLParse,
  DocumentNode as BaseDocumentNode,
  Source,
  ParseOptions,
} from 'graphql';

// @ts-ignore
export interface DocumentNode<Data = {}, Variables = {}, DeepPartial = {}>
  extends BaseDocumentNode {}

export const parse: <Data = {}, Variables = {}, DeepPartial = {}>(
  source: string | Source,
  options?: ParseOptions,
) => DocumentNode<Data, Variables, DeepPartial> = graphQLParse;
