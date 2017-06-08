// apollo-codegen uses Object.entries
require('core-js/es7/object');

import {
  GraphQLSchema,
  DocumentNode,
  GraphQLType,
  GraphQLOutputType,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLObjectType,
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
  typeCondition: GraphQLObjectType | GraphQLInterfaceType,
  possibleTypes: (GraphQLObjectType | GraphQLInterfaceType)[],
  fields: Field[],
  fragmentSpreads: string[],
  inlineFragments?: InlineFragment[],
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
