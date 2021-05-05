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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const generate = require('@babel/generator').default;

export interface ScalarDefinition {
  name: string;
  package?: string;
}

export interface Options {
  enumFormat?: EnumFormat;
  customScalars?: {[key: string]: ScalarDefinition};
}

export function generateSchemaTypes(
  schema: GraphQLSchema,
  options: Options = {},
) {
  const importFileBody: t.Statement[] = [];
  const exportFileBody: t.Statement[] = [];
  const definitions = new Map<string, string>();

  for (const type of Object.values(schema.getTypeMap())) {
    if (!isInputType(type) || type.name.startsWith('__')) {
      continue;
    }

    if (
      isScalarType(type) &&
      Object.prototype.hasOwnProperty.call(scalarTypeMap, type.name)
    ) {
      continue;
    }

    if (isEnumType(type)) {
      const enumType = tsEnumForType(type, options);

      definitions.set(
        `${enumType.id.name}.ts`,
        generate(
          t.file(t.program([t.exportNamedDeclaration(enumType, [])]), [], []),
        ).code,
      );

      importFileBody.unshift(
        t.importDeclaration(
          [t.importSpecifier(enumType.id, enumType.id)],
          t.stringLiteral(`./${enumType.id.name}`),
        ),
      );

      exportFileBody.unshift(
        t.exportNamedDeclaration(null, [
          t.exportSpecifier(enumType.id, enumType.id),
        ]),
      );
    } else if (isScalarType(type)) {
      const {customScalars = {}} = options;
      const customScalarDefinition = customScalars[type.name];
      const scalarType = tsScalarForType(type, customScalarDefinition);

      if (customScalarDefinition && customScalarDefinition.package) {
        importFileBody.unshift(
          t.importDeclaration(
            [
              t.importSpecifier(
                t.identifier(
                  makeCustomScalarImportNameSafe(
                    customScalarDefinition.name,
                    type.name,
                  ),
                ),
                t.identifier(customScalarDefinition.name),
              ),
            ],
            t.stringLiteral(customScalarDefinition.package),
          ),
        );

        exportFileBody.unshift(t.exportNamedDeclaration(scalarType, []));
      } else {
        exportFileBody.push(t.exportNamedDeclaration(scalarType, []));
      }
    } else {
      exportFileBody.push(
        t.exportNamedDeclaration(tsInputObjectForType(type), []),
      );
    }
  }

  // A blank file is ambiguous - its not clear if it is a script or a module.
  // If the file would be blank then give it an empty `export {}` to make in
  // unambiguously an es module file.
  // This ensures the generated files passes TypeScript type checking in
  // "isolatedModules" mode.
  if (exportFileBody.length === 0) {
    exportFileBody.push(t.exportNamedDeclaration(null, []));
  }

  return definitions.set(
    'index.ts',
    generate(t.file(t.program(importFileBody.concat(exportFileBody)), [], []))
      .code,
  );
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

function tsScalarForType(
  type: GraphQLScalarType,
  customScalarDefinition?: ScalarDefinition,
) {
  let alias;

  if (customScalarDefinition && customScalarDefinition.package) {
    alias = t.tsTypeReference(
      t.identifier(
        makeCustomScalarImportNameSafe(customScalarDefinition.name, type.name),
      ),
    );
  } else if (customScalarDefinition) {
    alias = t.tsTypeReference(t.identifier(customScalarDefinition.name));
  } else {
    alias = t.tsStringKeyword();
  }

  return t.tsTypeAliasDeclaration(t.identifier(type.name), null, alias);
}

function makeCustomScalarImportNameSafe(importName: string, typeName: string) {
  return `__${typeName}__${importName}`;
}

function tsEnumForType(
  type: GraphQLEnumType,
  {enumFormat}: Pick<Options, 'enumFormat'>,
) {
  return t.tsEnumDeclaration(
    t.identifier(type.name),
    type
      .getValues()
      .map(value =>
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
