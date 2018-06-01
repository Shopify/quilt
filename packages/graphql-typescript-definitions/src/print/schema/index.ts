import * as t from '@babel/types';
import {pascalCase, camelCase, snakeCase} from 'change-case';
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
import {EnumFormat} from '../../types';

const generate = require('@babel/generator').default;

type InputType = GraphQLEnumType | GraphQLScalarType | GraphQLInputObjectType;

export interface Options {
  enumFormat?: EnumFormat;
}

export function printSchema(schema: GraphQLSchema, options: Options = {}) {
  const fileBody: t.Statement[] = [];

  for (const type of Object.values(schema.getTypeMap())) {
    if (!isInputType(type) || type.name.startsWith('__')) {
      continue;
    }

    if (isScalarType(type) && scalarTypeMap.hasOwnProperty(type.name)) {
      continue;
    }

    fileBody.push(
      t.exportNamedDeclaration(tsTypeForRootInputType(type, options), []),
    );
  }

  const file = t.file(t.program(fileBody), [], []);
  return generate(file).code;
}

function tsTypeForRootInputType(type: InputType, options: Options) {
  if (isEnumType(type)) {
    return tsEnumForType(type, options);
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

function tsEnumForType(type: GraphQLEnumType, {enumFormat}: Options) {
  return t.tsEnumDeclaration(
    t.identifier(type.name),
    type
      .getValues()
      .map((value) =>
        t.tsEnumMember(
          t.identifier(enumMemberName(value.name, enumFormat)),
          t.stringLiteral(value.name),
        ),
      ),
  );
}

function enumMemberName(name: string, format?: EnumFormat) {
  switch (format) {
    case EnumFormat.CamelCase:
      return camelCase(name);
    case EnumFormat.PascalCase:
      return pascalCase(name);
    case EnumFormat.SnakeCase:
      return snakeCase(name);
    case EnumFormat.ScreamingSnakeCase:
      return snakeCase(name).toUpperCase();
    default:
      return name;
  }
}
