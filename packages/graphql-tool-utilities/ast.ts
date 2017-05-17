import {
  GraphQLSchema,
  DocumentNode,
  GraphQLType,
  GraphQLOutputType,
  GraphQLInputType,
} from 'graphql';
const {compileToIR} = require('apollo-codegen/lib/compilation');

export interface Variable {
  name: string,
  type: GraphQLInputType,
}

export interface Field {
  responseName: string,
  fieldName: string,
  type: GraphQLOutputType,
  fields?: Field[],
  fragmentSpreads?: string[],
  inlineFragments?: InlineFragment[],
}

export interface InlineFragment {
  typeCondition: GraphQLType,
  possibleTypes: GraphQLType[],
  fields: Field[],
  fragmentSpreads: string[],
}

export interface Fragment extends InlineFragment {
  filePath: string,
  fragmentName: string,
  source: string,
  fragmentsReferenced: string[],
  fields: Field[],
}

export interface Operation {
  filePath: string,
  operationName: string,
  operationType: 'query' | 'mutation' | 'subscription',
  variables: Variable[],
  fields: Field[],
  fragmentsReferenced: string[],
  fragmentSpreads?: string[],
}

export interface AST {
  operations: {[key: string]: Operation},
  fragments: {[key: string]: Fragment},
  typesUsed: GraphQLType[],
  schema: GraphQLSchema,
}

export interface Compile {
  (schema: GraphQLSchema, document: DocumentNode): AST,
}

export const compile: Compile = compileToIR;
