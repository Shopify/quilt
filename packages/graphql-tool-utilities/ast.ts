import {GraphQLSchema, DocumentNode, GraphQLType} from 'graphql';
const {compileToIR} = require('apollo-codegen/lib/compilation');

export interface AST {
  operations: {[key: string]: Operation},
  fragments: {[key: string]: FragmentSpread},
}

export interface Operation {
  fields: Field[],
  operationType: 'query' | 'mutation',
  filePath?: string,
}

export interface FragmentSpread {
  fields: Field[],
  typeCondition: GraphQLType,
  possibleTypes: GraphQLType[],
}

export interface Field {
  responseName: string,
  fieldName: string,
  type: GraphQLType,
  fields?: Field[],
  fragmentSpreads?: string[],
}

export interface Compile {
  (schema: GraphQLSchema, document: DocumentNode): AST,
}

export const compile: Compile = compileToIR;
