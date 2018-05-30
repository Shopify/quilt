import './polyfills';
import {
  GraphQLSchema,
  DocumentNode,
  GraphQLType,
  GraphQLOutputType,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';

const {
  compileToLegacyIR: compileToIR,
} = require('apollo-codegen/lib/compiler/legacyIR');

export enum OperationType {
  Query = 'query',
  Mutation = 'mutation',
  Subscription = 'subscription',
}

export interface Variable {
  name: string;
  type?: GraphQLInputType;
}

export interface TypedVariable {
  name: string;
  type: GraphQLInputType;
}

export interface Condition {
  kind: string;
  variableName: string;
  inverted: boolean;
}

export interface PrintableFieldDetails {
  fields?: Field[];
  fragmentSpreads?: string[];
  inlineFragments?: InlineFragment[] & {
    [key: string]: InlineFragment | undefined;
  };
}

export interface Field extends PrintableFieldDetails {
  responseName: string;
  fieldName: string;
  type: GraphQLOutputType;
  isConditional: boolean;
  conditions?: Condition[];
}

export interface InlineFragment extends PrintableFieldDetails {
  typeCondition: GraphQLObjectType | GraphQLInterfaceType;
  possibleTypes: (GraphQLObjectType | GraphQLInterfaceType)[];
}

export interface Fragment extends InlineFragment {
  filePath: string;
  fragmentName: string;
  source: string;
  fields: Field[];
}

export interface Operation extends PrintableFieldDetails {
  filePath: string;
  operationName: string;
  operationType: 'query' | 'mutation' | 'subscription';
  rootType: GraphQLObjectType;
  variables: Variable[];
  fragmentsReferenced: string[];
}

export interface AST {
  operations: {[key: string]: Operation};
  fragments: {[key: string]: Fragment};
  typesUsed: GraphQLType[];
  schema: GraphQLSchema;
}

export interface Compile {
  (schema: GraphQLSchema, document: DocumentNode): AST;
}

export function isOperation(
  operationOrFragment: Operation | Fragment,
): operationOrFragment is Operation {
  return (operationOrFragment as any).hasOwnProperty('operationName');
}

export function isTypedVariable(
  variable: Variable | TypedVariable,
): variable is TypedVariable {
  return variable.type != null;
}

export const compile: Compile = compileToIR;
