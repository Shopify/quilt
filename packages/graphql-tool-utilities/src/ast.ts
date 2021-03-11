import './polyfills';
import {DocumentNode, GraphQLInputType, GraphQLSchema} from 'graphql';
import {
  BooleanCondition,
  CompilerOptions,
  compileToLegacyIR as compileToIR,
  LegacyCompilerContext,
  LegacyField,
  LegacyFragment,
  LegacyInlineFragment,
  LegacyOperation,
} from 'apollo-codegen-core/lib/compiler/legacyIR';

export enum OperationType {
  Query = 'query',
  Mutation = 'mutation',
  Subscription = 'subscription',
}

export interface Variable {
  name: string;
  type?: GraphQLInputType;
}

export interface TypedVariable extends Variable {
  type: GraphQLInputType;
}

export interface PrintableFieldDetails {
  fields?: Field[];
  fragmentSpreads?: string[];
  inlineFragments?: InlineFragment[];
}

export interface Condition extends BooleanCondition {
  kind: string;
}

export interface Field extends LegacyField {
  conditions?: Condition[];
  fields?: Field[];
  inlineFragments?: InlineFragment[] & {
    [typeName: string]: InlineFragment;
  };
}

export interface InlineFragment extends LegacyInlineFragment {
  fields: Field[];
}

export interface Fragment extends LegacyFragment {
  fields: Field[];
  inlineFragments: InlineFragment[] & {
    [typeName: string]: InlineFragment;
  };
}

export interface Operation extends LegacyOperation {
  fields: Field[];
  variables: TypedVariable[];
  inlineFragments?: InlineFragment[] & {
    [typeName: string]: InlineFragment;
  };
}

export interface AST extends LegacyCompilerContext {
  operations: {
    [operationName: string]: Operation;
  };
  fragments: {
    [fragmentName: string]: Fragment;
  };
}

export function isOperation(
  operationOrFragment: Operation | Fragment,
): operationOrFragment is Operation {
  return Object.prototype.hasOwnProperty.call(
    operationOrFragment,
    'operationName',
  );
}

export function isTypedVariable(
  variable: Variable | TypedVariable,
): variable is TypedVariable {
  return variable.type != null;
}

export interface Compile {
  (
    schema: GraphQLSchema,
    document: DocumentNode,
    options?: CompilerOptions,
  ): AST;
}

export const compile = compileToIR as Compile;
