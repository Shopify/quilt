import * as t from '@babel/types';
import {
  GraphQLString,
  GraphQLInputType,
  isEnumType,
  isObjectType,
  isNonNullType,
  isScalarType,
  isListType,
  GraphQLType,
  GraphQLNonNull,
  isInputObjectType,
  isInterfaceType,
  isUnionType,
  GraphQLCompositeType,
} from 'graphql';
import {
  Field,
  TypedVariable,
  isTypedVariable,
  Variable,
  InlineFragment,
  PrintableFieldDetails,
} from 'graphql-tool-utilities/ast';

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
    (context.options.addTypename || requiresTypename) &&
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
    t.identifier(`${stack.name}${typeCondition.name}`),
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
    const missingPossibleTypes =
      isInterfaceType(graphQLType) || isUnionType(graphQLType)
        ? context.ast.schema
            .getPossibleTypes(graphQLType)
            .filter((possibleType) => {
              return !typesCoveredByInlineFragments.has(possibleType);
            })
        : [];

    let otherType: t.TSType | null = null;

    if (missingPossibleTypes.length > 0) {
      const otherTypeInterface = t.tsInterfaceDeclaration(
        t.identifier(`${stack.name}Other`),
        null,
        null,
        tsInterfaceBodyForObjectField(
          field,
          missingPossibleTypes,
          stack,
          context,
          context.options.partial,
        ),
      );

      otherType = context.export(otherTypeInterface);
    }

    return t.tsUnionType(
      otherType ? [...fragmentTypes, otherType] : fragmentTypes,
    );
  }

  const interfaceDeclaration = t.tsInterfaceDeclaration(
    t.identifier(stack.name),
    null,
    null,
    tsInterfaceBodyForObjectField(field, graphQLType, stack, context),
  );

  return context.export(interfaceDeclaration);
}

function tsTypenameForGraphQLType(type: GraphQLCompositeType) {
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

    const typename = Array.isArray(parentType)
      ? t.tsUnionType(parentType.map(tsTypenameForGraphQLType))
      : tsTypenameForGraphQLType(parentType);

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
