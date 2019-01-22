import * as t from '@babel/types';
import {
  GraphQLString,
  isEnumType,
  isObjectType,
  isNonNullType,
  isScalarType,
  isListType,
  isAbstractType,
  GraphQLInputType,
  GraphQLType,
  GraphQLNonNull,
  GraphQLObjectType,
  isInputObjectType,
  isInterfaceType,
  isUnionType,
  GraphQLCompositeType,
} from 'graphql';
import {
  Field,
  InlineFragment,
  isTypedVariable,
  PrintableFieldDetails,
  TypedVariable,
  Variable,
} from 'graphql-tool-utilities';

import {scalarTypeMap} from '../utilities';

import {ObjectStack} from './utilities';
import {OperationContext} from './context';

export function tsInterfaceBodyForObjectField(
  {fields = []}: PrintableFieldDetails,
  graphQLType: GraphQLCompositeType | GraphQLCompositeType[],
  stack: ObjectStack,
  context: OperationContext,
  requiresTypename = false,
) {
  const {schema} = context.ast;
  const isRootType =
    !Array.isArray(graphQLType) &&
    (graphQLType === schema.getQueryType() ||
      graphQLType === schema.getMutationType() ||
      graphQLType === schema.getSubscriptionType());

  const uniqueFields = fields.filter((field) => {
    if (stack.hasSeenField(field)) {
      return false;
    }

    stack.sawField(field);
    return true;
  });

  const typenameField = {
    fieldName: '__typename',
    responseName: '__typename',
    type: new GraphQLNonNull(GraphQLString),
    isConditional: false,
  };

  const typename =
    ((context.options.addTypename && !isRootType) || requiresTypename) &&
    !stack.hasSeenField(typenameField)
      ? tsPropertyForField(
          typenameField,
          graphQLType,
          stack,
          context,
          requiresTypename,
        )
      : null;

  const body = uniqueFields.map((field) =>
    tsPropertyForField(field, graphQLType, stack, context, requiresTypename),
  );

  return t.tsInterfaceBody(typename ? [typename, ...body] : body);
}

function tsTypeForInlineFragment(
  inlineFragment: InlineFragment,
  _graphQLType: GraphQLCompositeType,
  stack: ObjectStack,
  context: OperationContext,
  requiresTypename = false,
) {
  const {typeCondition} = inlineFragment;
  const interfaceDeclaration = t.tsInterfaceDeclaration(
    t.identifier(stack.name),
    null,
    null,
    tsInterfaceBodyForObjectField(
      inlineFragment,
      typeCondition,
      stack,
      context,
      requiresTypename,
    ),
  );

  return context.export(interfaceDeclaration);
}

function tsTypeForObjectField(
  field: Field,
  graphQLType: GraphQLCompositeType,
  stack: ObjectStack,
  context: OperationContext,
) {
  const {inlineFragments = []} = field;
  const possibleTypes =
    isInterfaceType(graphQLType) || isUnionType(graphQLType)
      ? context.ast.schema.getPossibleTypes(graphQLType)
      : [];

  if (inlineFragments.length) {
    const fragmentTypes = [...inlineFragments].map((inlineFragment) =>
      tsTypeForInlineFragment(
        inlineFragment,
        graphQLType,
        stack.fragment(inlineFragment.typeCondition),
        context,
        context.options.partial,
      ),
    );

    const typesCoveredByInlineFragments = new Set(
      [...inlineFragments].reduce<GraphQLType[]>(
        (types, inlineFragment) => [...types, ...inlineFragment.possibleTypes],
        [],
      ),
    );

    const missingPossibleTypes = possibleTypes.filter((possibleType) => {
      return !typesCoveredByInlineFragments.has(possibleType);
    });

    const otherStack = stack.fragment();
    const otherTypeInterface = t.tsInterfaceDeclaration(
      t.identifier(otherStack.name),
      null,
      null,
      tsInterfaceBodyForObjectField(
        field,
        missingPossibleTypes,
        otherStack,
        context,
        context.options.partial,
      ),
    );

    const otherType = context.export(otherTypeInterface);

    return t.tsUnionType([...fragmentTypes, otherType]);
  } else if (possibleTypes.length === 1) {
    // When we have an interface or union type, but no inline fragments, it
    // means that there is only one conforming type for the union/ interface.
    // Here, we construct a "nothing" type that stands in for future additions
    // to the membership of the union/ interface.
    const otherStack = stack.fragment();
    const otherTypeInterface = t.tsInterfaceDeclaration(
      t.identifier(otherStack.name),
      null,
      null,
      tsInterfaceBodyForObjectField(
        {fields: []},
        [],
        otherStack,
        context,
        context.options.partial,
      ),
    );

    const interfaceStack = stack.fragment(possibleTypes[0]);
    const interfaceDeclaration = t.tsInterfaceDeclaration(
      t.identifier(interfaceStack.name),
      null,
      null,
      tsInterfaceBodyForObjectField(
        field,
        graphQLType,
        interfaceStack,
        context,
      ),
    );

    return t.tsUnionType([
      context.export(interfaceDeclaration),
      context.export(otherTypeInterface),
    ]);
  }

  const interfaceDeclaration = t.tsInterfaceDeclaration(
    t.identifier(stack.name),
    null,
    null,
    tsInterfaceBodyForObjectField(field, graphQLType, stack, context),
  );

  return context.export(interfaceDeclaration);
}

function tsTypenameForGraphQLType(type: GraphQLObjectType) {
  return t.tsLiteralType(t.stringLiteral(type.name));
}

function tsPropertyForField(
  field: Field,
  parentType: GraphQLCompositeType | GraphQLCompositeType[],
  stack: ObjectStack,
  context: OperationContext,
  isRequiredTypename = false,
) {
  if (field.fieldName === '__typename' && parentType) {
    const optional =
      !isRequiredTypename &&
      (context.options.partial ||
        field.isConditional ||
        !isNonNullType(field.type));

    const parentTypes = Array.isArray(parentType) ? parentType : [parentType];
    const allPossibleTypes = parentTypes.reduce<GraphQLObjectType[]>(
      (all, type) => [
        ...all,
        ...(isAbstractType(type)
          ? context.ast.schema.getPossibleTypes(type)
          : [type]),
      ],
      [],
    );

    let typename: t.TSType;

    if (allPossibleTypes.length === 0) {
      typename = t.tsNeverKeyword();
    } else if (allPossibleTypes.length > 1) {
      typename = t.tsUnionType(allPossibleTypes.map(tsTypenameForGraphQLType));
    } else {
      typename = tsTypenameForGraphQLType(allPossibleTypes[0]);
    }

    const typenameProperty = t.tsPropertySignature(
      t.identifier(field.responseName),
      optional
        ? t.tsTypeAnnotation(t.tsUnionType([typename, t.tsNullKeyword()]))
        : t.tsTypeAnnotation(typename),
    );

    typenameProperty.optional = optional;
    return typenameProperty;
  }

  const property = t.tsPropertySignature(
    t.identifier(field.responseName),
    t.tsTypeAnnotation(tsTypeForGraphQLType(field.type, field, stack, context)),
  );

  property.optional =
    context.options.partial ||
    field.isConditional ||
    !isNonNullType(field.type);

  return property;
}

function tsTypeForGraphQLType(
  graphQLType: GraphQLType,
  field: Field,
  stack: ObjectStack,
  context: OperationContext,
) {
  let type: t.TSType;
  const forceNullable =
    context.options.partial ||
    (field.isConditional && graphQLType === field.type);
  const isNonNull = !forceNullable && isNonNullType(graphQLType);
  const unwrappedGraphQLType: GraphQLType = isNonNullType(graphQLType)
    ? graphQLType.ofType
    : graphQLType;

  if (isScalarType(unwrappedGraphQLType)) {
    if (scalarTypeMap.hasOwnProperty(unwrappedGraphQLType.name)) {
      type = scalarTypeMap[unwrappedGraphQLType.name];
    } else {
      context.file.import(unwrappedGraphQLType.name);
      type = t.tsTypeReference(t.identifier(unwrappedGraphQLType.name));
    }
  } else if (isEnumType(unwrappedGraphQLType)) {
    context.file.import(unwrappedGraphQLType.name);
    type = t.tsTypeReference(t.identifier(unwrappedGraphQLType.name));
  } else if (isListType(unwrappedGraphQLType)) {
    const {ofType} = unwrappedGraphQLType;
    const arrayType = tsTypeForGraphQLType(ofType, field, stack, context);
    type = t.tsArrayType(
      t.isTSUnionType(arrayType) ? t.tsParenthesizedType(arrayType) : arrayType,
    );
  } else if (
    isObjectType(unwrappedGraphQLType) ||
    isInterfaceType(unwrappedGraphQLType) ||
    isUnionType(unwrappedGraphQLType)
  ) {
    type = tsTypeForObjectField(
      field,
      unwrappedGraphQLType,
      stack.nested(field, unwrappedGraphQLType),
      context,
    );
  } else {
    type = t.tsAnyKeyword();
  }

  return isNonNull ? type : t.tsUnionType([type, t.tsNullKeyword()]);
}

export function variablesInterface(
  variables: Variable[],
  context: OperationContext,
) {
  return t.tsInterfaceDeclaration(
    t.identifier('Variables'),
    null,
    null,
    t.tsInterfaceBody(
      variables
        .filter(isTypedVariable)
        .map((variable) => tsPropertyForVariable(variable, context)),
    ),
  );
}

function tsPropertyForVariable(
  {name, type}: TypedVariable,
  context: OperationContext,
) {
  const property = t.tsPropertySignature(
    t.identifier(name),
    t.tsTypeAnnotation(tsTypeForGraphQLInputType(type, context)),
  );

  property.optional = !isNonNullType(type);
  return property;
}

function tsTypeForGraphQLInputType(
  graphQLType: GraphQLInputType,
  context: OperationContext,
) {
  let type: t.TSType;

  const unwrappedGraphQLType = isNonNullType(graphQLType)
    ? graphQLType.ofType
    : graphQLType;

  if (isScalarType(unwrappedGraphQLType)) {
    if (scalarTypeMap.hasOwnProperty(unwrappedGraphQLType.name)) {
      type = scalarTypeMap[unwrappedGraphQLType.name];
    } else {
      context.file.import(unwrappedGraphQLType.name);
      type = t.tsTypeReference(t.identifier(unwrappedGraphQLType.name));
    }
  } else if (
    isEnumType(unwrappedGraphQLType) ||
    isInputObjectType(unwrappedGraphQLType)
  ) {
    context.file.import(unwrappedGraphQLType.name);
    type = t.tsTypeReference(t.identifier(unwrappedGraphQLType.name));
  } else {
    const {ofType} = unwrappedGraphQLType;
    const arrayType = tsTypeForGraphQLInputType(ofType, context);
    type = t.tsArrayType(
      isNonNullType(ofType) ? arrayType : t.tsParenthesizedType(arrayType),
    );
  }

  return isNonNullType(graphQLType)
    ? type
    : t.tsUnionType([type, t.tsNullKeyword()]);
}
