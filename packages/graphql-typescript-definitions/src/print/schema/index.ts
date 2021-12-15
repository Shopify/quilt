import * as t from '@babel/types';
import {pascalCase, camelCase, snakeCase} from 'change-case';
import {ArgumentAtIndex} from '@shopify/useful-types';
import {
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLNamedType,
  GraphQLType,
  isScalarType,
  isNonNullType,
  isEnumType,
  isListType,
  isUnionType,
  isInterfaceType,
  isInputType,
  isObjectType,
  isInputObjectType,
} from 'graphql';

import {scalarTypeMap} from '../utilities';
import {EnumFormat} from '../../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const generate = require('@babel/generator').default;

export interface ScalarDefinition {
  name: string;
  package?: string;
}

interface CustomScalars {
  [key: string]: ScalarDefinition;
}

export interface Options {
  enumFormat?: EnumFormat;
  customScalars?: CustomScalars;
  addTypename?: boolean;
}

const RootOperationTypes = ['Query', 'Mutation', 'Subscription'];

export function generateSchemaTypes(
  schema: GraphQLSchema,
  options: Options = {addTypename: true},
) {
  const importFileBody = new Map<string, t.Statement>();
  const exportFileBody = new Map<string, t.Statement>();
  const definitions = new Map<string, string>();

  const uniqueTypes = new Set<GraphQLType>();

  function addDefinition(path: string, body: t.Statement[]) {
    return definitions.set(
      path,
      generate(t.file(t.program(body), [], [])).code,
    );
  }

  function addImport(
    name: string,
    specifiers: ArgumentAtIndex<typeof t.importDeclaration, 0>,
    source: ArgumentAtIndex<typeof t.importDeclaration, 1>,
  ) {
    importFileBody.set(name, t.importDeclaration(specifiers, source));
  }

  function addExport(
    name: string,
    declaration: ArgumentAtIndex<typeof t.exportNamedDeclaration, 0>,
    specifiers: ArgumentAtIndex<typeof t.exportNamedDeclaration, 1>,
  ) {
    exportFileBody.set(name, t.exportNamedDeclaration(declaration, specifiers));
  }

  function wrapNonNullType(
    tsType: t.TSType,
    type: GraphQLType,
    nullable: boolean,
  ): t.TSType {
    return !nullable || isNonNullType(type)
      ? tsType
      : t.tsUnionType([tsType, t.tsNullKeyword()]);
  }

  function getNamedTypeReference(
    type: GraphQLType,
  ):
    | t.TSTypeReference
    | t.TSBooleanKeyword
    | t.TSNumberKeyword
    | t.TSStringKeyword {
    if (isNonNullType(type) || isListType(type)) {
      return getNamedTypeReference(type.ofType);
    }
    if (Object.prototype.hasOwnProperty.call(scalarTypeMap, type.name)) {
      return scalarTypeMap[type.name];
    }
    return t.tsTypeReference(t.identifier(type.name));
  }

  function getType(type: GraphQLNamedType, nullable = true): t.TSType {
    const unwrappedType = isNonNullType(type) ? type.ofType : type;

    // preserve list types
    if (isListType(unwrappedType)) {
      const tsTypeOfContainedType = getType(unwrappedType.ofType);
      return wrapNonNullType(
        t.tsArrayType(
          t.isTSUnionType(tsTypeOfContainedType)
            ? t.tsParenthesizedType(tsTypeOfContainedType)
            : tsTypeOfContainedType,
        ),
        type,
        nullable,
      );
    }

    // return primitive scalar types as native ts types
    if (
      Object.prototype.hasOwnProperty.call(scalarTypeMap, unwrappedType.name)
    ) {
      return wrapNonNullType(scalarTypeMap[unwrappedType.name], type, nullable);
    }

    // return reference to already named types
    if (uniqueTypes.has(unwrappedType)) {
      return wrapNonNullType(getNamedTypeReference(type), type, nullable);
    }

    uniqueTypes.add(unwrappedType);

    // add type references based on graphql type
    if (isScalarType(unwrappedType)) {
      // handle custom scalars with imports
      const {customScalars = {}} = options;
      const customScalarDefinition = customScalars[unwrappedType.name];

      if (customScalarDefinition && customScalarDefinition.package) {
        addImport(
          unwrappedType.name,
          [
            t.importSpecifier(
              t.identifier(
                makeCustomScalarImportNameSafe(
                  customScalarDefinition.name,
                  unwrappedType.name,
                ),
              ),
              t.identifier(customScalarDefinition.name),
            ),
          ],
          t.stringLiteral(customScalarDefinition.package),
        );
      }

      // define ts type for scalar
      const typeAnnotation =
        getCustomScalalarType(unwrappedType, customScalarDefinition) ||
        t.tsStringKeyword();

      // add export of custom scalar type
      addExport(
        unwrappedType.name,
        t.tsTypeAliasDeclaration(
          t.identifier(unwrappedType.name),
          null,
          typeAnnotation,
        ),
        [],
      );
    } else if (isUnionType(unwrappedType)) {
      // get all union type options
      const unionOptions = unwrappedType
        .getTypes()
        .map((item) => getType(item, false));

      const unionType = t.tsUnionType(unionOptions.filter(Boolean));

      addExport(
        unwrappedType.name,
        t.tsTypeAliasDeclaration(
          t.identifier(unwrappedType.name),
          null,
          unionType,
        ),
        [],
      );
    } else if (isEnumType(unwrappedType)) {
      const enumType = t.tsEnumDeclaration(
        t.identifier(unwrappedType.name),
        unwrappedType
          .getValues()
          .map((value) =>
            t.tsEnumMember(
              t.identifier(enumMemberName(value.name, options.enumFormat)),
              t.stringLiteral(value.name),
            ),
          ),
      );

      addDefinition(`${enumType.id.name}.ts`, [
        t.exportNamedDeclaration(enumType, []),
      ]);

      addImport(
        unwrappedType.name,
        [t.importSpecifier(enumType.id, enumType.id)],
        t.stringLiteral(`./${enumType.id.name}`),
      );

      addExport(unwrappedType.name, null, [
        t.exportSpecifier(enumType.id, enumType.id),
      ]);
    } else if (
      isObjectType(unwrappedType) ||
      isInputObjectType(unwrappedType) ||
      isInterfaceType(unwrappedType)
    ) {
      let extensions: t.TSExpressionWithTypeArguments[] = [];

      if (!isInputType(unwrappedType)) {
        extensions = unwrappedType.getInterfaces().map((extendsType) => {
          // @TODO: should we do anything with this value?
          getType(extendsType);
          return t.tsExpressionWithTypeArguments(
            t.identifier(extendsType.name),
          );
        });
      }

      const fields = Object.entries(unwrappedType.getFields()).map(
        ([name, field]) => {
          const infered = getType(field.type);

          const property = t.tsPropertySignature(
            t.identifier(name),
            t.tsTypeAnnotation(infered),
          );
          property.optional = !isNonNullType(field.type);

          (field?.args ?? []).forEach((arg) => {
            getType(arg.type);
          });

          return property;
        },
      );

      if (
        !isInputType(unwrappedType) &&
        !isInterfaceType(unwrappedType) &&
        options.addTypename &&
        !['Query', 'Mutation', 'Subscription'].includes(unwrappedType.name)
      ) {
        fields.unshift(
          t.tsPropertySignature(
            t.identifier('__typename'),
            t.tsTypeAnnotation(
              t.tsLiteralType(t.stringLiteral(unwrappedType.name)),
            ),
          ),
        );
      }

      const interfaceType = t.tsInterfaceDeclaration(
        t.identifier(unwrappedType.name),
        null,
        extensions,
        t.tsInterfaceBody(fields),
      );

      if (isInterfaceType(unwrappedType)) {
        exportFileBody.set(unwrappedType.name, interfaceType);
      } else {
        addExport(unwrappedType.name, interfaceType, []);
      }
    }

    // unwrap type reference
    return getType(type, nullable);
  }

  [
    schema.getQueryType(),
    schema.getMutationType(),
    schema.getSubscriptionType(),
  ]
    .filter((type): type is GraphQLObjectType => Boolean(type))
    .filter((type) => Object.values(type.getFields()).length > 0)
    .forEach((type) => getType(type));

  // A blank file is ambiguous - its not clear if it is a script or a module.
  // If the file would be blank then give it an empty `export {}` to make in
  // unambiguously an es module file.
  // This ensures the generated files passes TypeScript type checking in
  // "isolatedModules" mode.
  if (exportFileBody.size === 0) {
    addExport('null', null, []);
  }

  const exports = Array.from(exportFileBody.keys())
    .sort((alpha, beta) => {
      const isImport = (name: string) => (importFileBody.has(name) ? 1 : 0);

      return isImport(beta) - isImport(alpha);
    })
    .sort((alpha, beta) => {
      const isRoot = (name: string) =>
        RootOperationTypes.includes(name) ? 1 : 0;

      return isRoot(alpha) - isRoot(beta);
    })
    .map((key) => exportFileBody.get(key)!);

  const imports = Array.from(importFileBody.values());

  return addDefinition('index.ts', [...imports, ...exports]);
}

function getCustomScalalarType(
  type: GraphQLScalarType | GraphQLObjectType,
  customScalarDefinition?: ScalarDefinition,
): t.TSTypeReference | undefined {
  if (customScalarDefinition && customScalarDefinition.package) {
    return t.tsTypeReference(
      t.identifier(
        makeCustomScalarImportNameSafe(customScalarDefinition.name, type.name),
      ),
    );
  }

  if (customScalarDefinition) {
    return t.tsTypeReference(t.identifier(customScalarDefinition.name));
  }
}

function makeCustomScalarImportNameSafe(importName: string, typeName: string) {
  return `__${typeName}__${importName}`;
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
