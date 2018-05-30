import * as t from '@babel/types';
import {
  GraphQLSchema,
  isEnumType,
  GraphQLEnumType,
  isInputType,
  GraphQLScalarType,
  isScalarType,
  GraphQLInputObjectType,
  isNonNullType,
  GraphQLInputType,
  isListType,
} from 'graphql';
import {scalarTypeMap} from '../utilities';

const generate = require('@babel/generator').default;

type InputType = GraphQLEnumType | GraphQLScalarType | GraphQLInputObjectType;

export function printSchema(schema: GraphQLSchema) {
  const fileBody: t.Statement[] = [];

  for (const type of Object.values(schema.getTypeMap())) {
    if (!isInputType(type) || type.name.startsWith('__')) {
      continue;
    }

    if (isScalarType(type) && scalarTypeMap.hasOwnProperty(type.name)) {
      continue;
    }

    fileBody.push(t.exportNamedDeclaration(tsTypeForRootInputType(type), []));
  }

  const file = t.file(t.program(fileBody), [], []);
  return generate(file).code;
}

function tsTypeForRootInputType(type: InputType) {
  if (isEnumType(type)) {
    return tsEnumForType(type);
  } else if (isScalarType(type)) {
    return tsScalarForType(type);
  } else {
    return tsInputObjectForType(type);
  }
}

function tsTypeForInputType(type: GraphQLInputType): t.TSType {
  const unwrappedType = isNonNullType(type) ? type.ofType : type;

  let tsType: t.TSType;

  if (isListType(unwrappedType)) {
    const tsTypeOfContainedType = tsTypeForInputType(unwrappedType.ofType);
    tsType = t.tsArrayType(
      t.isTSUnionType(tsTypeOfContainedType)
        ? t.tsParenthesizedType(tsTypeOfContainedType)
        : tsTypeOfContainedType,
    );
  } else if (isScalarType(unwrappedType)) {
    tsType =
      scalarTypeMap[unwrappedType.name] ||
      t.tsTypeReference(t.identifier(unwrappedType.name));
  } else {
    tsType = t.tsTypeReference(t.identifier(unwrappedType.name));
  }

  return isNonNullType(type)
    ? tsType
    : t.tsUnionType([tsType, t.tsNullKeyword()]);
}

function tsInputObjectForType(type: GraphQLInputObjectType) {
  const fields = Object.entries(type.getFields()).map(([name, field]) => {
    const property = t.tsPropertySignature(
      t.identifier(name),
      t.tsTypeAnnotation(tsTypeForInputType(field.type)),
    );
    property.optional = !isNonNullType(field.type);
    return property;
  });

  return t.tsInterfaceDeclaration(
    t.identifier(type.name),
    null,
    null,
    t.tsInterfaceBody(fields),
  );
}

function tsScalarForType(type: GraphQLScalarType) {
  return t.tsTypeAliasDeclaration(
    t.identifier(type.name),
    null,
    t.tsStringKeyword(),
  );
}

function tsEnumForType(type: GraphQLEnumType) {
  return t.tsEnumDeclaration(
    t.identifier(type.name),
    type
      .getValues()
      .map((value) =>
        t.tsEnumMember(t.identifier(value.name), t.stringLiteral(value.name)),
      ),
  );
}
