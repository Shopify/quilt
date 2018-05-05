import {relative, dirname} from 'path';
import {pascal} from 'change-case';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLType,
} from 'graphql';
import {Operation, Fragment, AST, Field} from 'graphql-tool-utilities/ast';

import CodeGenerator from './generator';
import Context, {Options} from './context';
import Document, {FieldObject} from './document';
import {
  printInputGraphQLField,
  printRootGraphQLType,
  builtInScalarMap,
  getRootGraphQLType,
  GraphQLPrintableType,
} from './graphql';
import {NullableFragment} from './special-types';
import {
  printExport,
  printImport,
  printInterface,
  printNamespace,
  printPropertyKey,
} from './language';

export interface File {
  path: string,
  operations: Operation[],
  fragments: Fragment[],
}

export {Options};

export function printFile(
  {operations, fragments, path}: File,
  ast: AST,
  options: Options,
) {
  if (operations.length === 0 && fragments.length === 0) {
    return '';
  }

  const generator = new CodeGenerator();
  const context = new Context(ast, options);

  generator.printOnNewline('// This file was generated and should not be edited.');
  generator.printOnNewline('/* tslint:disable */');
  generator.printEmptyLine();
  generator.printOnNewline("import {DocumentNode} from 'graphql';");
  generator.printEmptyLine();

  const subGenerator = new CodeGenerator();

  for (const operation of operations) {
    printOperation(operation, subGenerator, context);
  }

  for (const fragment of fragments) {
    printFragment(fragment, subGenerator, context);
  }

  Array.from(context.importsUsed).forEach(([importPath, specifiers]) => {
    if (importPath === path) { return; }

    let relativePath = relative(dirname(path), importPath);
    if (!relativePath.startsWith('.')) {
      relativePath = `./${relativePath}`;
    }

    printImport({
      specifiers: Array.from(specifiers).map((specifier) => `${specifier}Data`),
      source: relativePath,
    }, generator);
  });

  generator.printEmptyLine();

  Array.from(context.specialTypesUsed).reverse().forEach((type) => {
    type.print(generator);
  });

  const typesUsed = Array.from(context.typesUsed).reverse();
  if (typesUsed.length > 0) {
    printExport(() => {
      printNamespace('Schema', () => {
        Array.from(context.typesUsed).reverse().forEach((type) => {
          printExport(() => printRootGraphQLType(type, generator), generator);
          generator.printEmptyLine();
        });
      }, generator);
    }, generator);
    generator.printEmptyLine();
  }

  generator.printOnNewline(subGenerator.output);

  generator.printEmptyLine();
  generator.printOnNewline('declare const document: DocumentNode;');
  generator.printOnNewline('export default document;');
  generator.printEmptyLine();

  generator.printOnNewline('/* tslint:enable */');
  generator.printNewline();

  return generator.output;
}

function printFieldObject(fieldObject: FieldObject, generator: CodeGenerator, context: Context) {
  const {field, compositeType} = fieldObject;
  const {fields = [], fragmentSpreads = [], inlineFragments = [], type} = field;
  const spreads = fragmentSpreads.map((spread) => {
    const fragment = context.ast.fragments[spread];
      
    let fragmentName = `${fragment.fragmentName}FragmentData`;
    if (fragment.typeCondition !== compositeType) {
      context.addUsedSpecialType(NullableFragment);
      fragmentName = `${NullableFragment.typeName}<${fragmentName}>`;
    }

    return fragmentName;
  })

  printExport(() => {
    printInterface({name: fieldObject.name, extend: spreads}, () => {
      const seenFields = new Set<string>();

      if (context.options.addTypename) {
        printTypenameProperty(type, '__typename', generator, context);
      }

      for (const field of fields) {
        const {fieldName, responseName} = field;

        if (fieldName === '__typename') {
          if (responseName !== fieldName || !context.options.addTypename) {
            printTypenameProperty(type, responseName, generator, context);
          }

          continue;
        }

        seenFields.add(responseName);
        printField(field, false, generator, context);
      };

      inlineFragments.forEach((fragment) => {
        fragment.fields.forEach((field) => {
          if (seenFields.has(field.responseName)) { return; }
          seenFields.add(field.responseName);

          // If it's not on `fields`, there is no guaranteed match, so we need
          // to say that it can be nullable
          printField(field, true, generator, context);
        });
      });
    }, generator);
  }, generator);
}

function printTypenameProperty(
  type: GraphQLType | ReadonlyArray<GraphQLType>,
  key: string,
  generator: CodeGenerator,
  context: Context,
) {
  if (Array.isArray(type)) {
    printPropertyKey(key, false, generator);
    const types = type.map((aType) => `'${getRootGraphQLType(aType).name}'`);
    generator.print(`${types.join(' | ')},`);
  } else {
    const finalType = getRootGraphQLType(type as GraphQLType);

    if (
      finalType instanceof GraphQLInterfaceType ||
      finalType instanceof GraphQLUnionType
    ) {
      printTypenameProperty(context.ast.schema.getPossibleTypes(finalType), key, generator, context);
      return;
    }

    printPropertyKey(key, false, generator);
    generator.print(`'${finalType.name}',`);
  }
}

function printFragment(
  fragment: Fragment,
  generator: CodeGenerator,
  context: Context,
) {
  const {
    fields,
    fragmentName,
    fragmentSpreads,
    inlineFragments = [],
    typeCondition,
    possibleTypes,
  } = fragment;
  const typeConditionFieldMap = typeCondition.getFields();
  const finalFragmentSreads = fragmentSpreads.map((spread) => {
    const fragment = context.ast.fragments[spread];

    if (fragment.typeCondition === typeCondition) {
      return `${spread}FragmentData`;
    } else {
      context.addUsedSpecialType(NullableFragment);
      return `${NullableFragment.typeName}<${spread}FragmentData>`;
    }
  });

  const document = new Document(`${fragmentName}FragmentData`, fragment);
  context.document = document;

  context.addUsedExternalFragments(fragmentSpreads);

  printExport(() => {
    printInterface({
      name: document.name,
      extend: finalFragmentSreads,
    }, () => {
      const seenFields = new Set<string>();

      if (context.options.addTypename) {
        printTypenameProperty(possibleTypes, '__typename', generator, context);
      }

      for (const field of fields) {
        const {fieldName, responseName} = field;

        if (fieldName === '__typename') {
          if (responseName !== fieldName || !context.options.addTypename) {
            printTypenameProperty(possibleTypes, responseName, generator, context);
          }

          continue;
        }

        seenFields.add(field.responseName);
        printField(field, false, generator, context);
      }

      for (const inlineFragment of inlineFragments) {
        const {fields: fragmentFields, typeCondition: fragmentTypeCondition} = inlineFragment

        for (const field of fragmentFields) {
          if (seenFields.has(field.responseName)) { continue; }
          seenFields.add(field.responseName);
          const forceNullable = (typeCondition !== fragmentTypeCondition) && typeConditionFieldMap[field.fieldName] == null;
          printField(field, forceNullable, generator, context);
        }
      }
    }, generator);
  }, generator);

  generator.printEmptyLine();

  if (document.fieldObjects.length) {
    printExport(() => {
      printNamespace(document.name, () => {
        for (const fieldObject of document.fieldObjects) {
          printFieldObject(fieldObject, generator, context);
          generator.printEmptyLine();
        }
      }, generator);
    }, generator);

    generator.printEmptyLine();
  }
}

function printOperation(
  operation: Operation,
  generator: CodeGenerator,
  context: Context,
) {
  const {
    fields,
    variables,
    operationName,
    operationType,
    fragmentSpreads = [],
    fragmentsReferenced,
  } = operation;

  const document = new Document(`${operationName}${pascal(operationType)}Data`, operation);
  context.document = document;

  context.addUsedExternalFragments(fragmentsReferenced);

  printExport(() => {
    printInterface({
      name: document.name,
      extend: fragmentSpreads.map((spread) => `${spread}FragmentData`),
    }, () => {
      fields.forEach((field) => {
        printField(field, false, generator, context);
      });
    }, generator);
  }, generator);

  generator.printEmptyLine();

  if (document.fieldObjects.length || variables.length) {
    printExport(() => {
      printNamespace(document.name, () => {
        if (variables.length) {
          printExport(() => {
            printInterface({
              name: 'Variables',
            }, () => {
              for (const {name, type} of variables) {
                context.addUsedType(type);
                printInputGraphQLField(name, type, generator);
              }
            }, generator);
          }, generator);

          generator.printEmptyLine();
        }

        for (const fieldObject of document.fieldObjects) {
          printFieldObject(fieldObject, generator, context);
          generator.printEmptyLine();
        }
      }, generator);
    }, generator);

    generator.printEmptyLine();
  }
}

function printField(
  field: Field,
  forceNullable = false,
  generator: CodeGenerator,
  context: Context,
) {
  const {responseName, type} = field;
  let currentType = type;
  const nullable = forceNullable || !(currentType instanceof GraphQLNonNull);
  const printBefore: string[] = [];
  const printAfter: string[] = nullable ? [' | null'] : [];

  printPropertyKey(responseName, nullable, generator);

  while (currentType instanceof GraphQLList || currentType instanceof GraphQLNonNull) {
    if (currentType instanceof GraphQLList) {
      currentType = currentType.ofType;

      if (currentType instanceof GraphQLNonNull) {
        printAfter.push('[]');
        currentType = currentType.ofType;
      } else {
        printBefore.push('(');
        printAfter.push(' | null)[]');
      }
    } else {
      currentType = currentType.ofType;
    }
  }

  const finalType = currentType as GraphQLPrintableType;

  generator.print(printBefore.join(''));

  if (finalType instanceof GraphQLScalarType) {
    if (builtInScalarMap.hasOwnProperty(finalType.name)) {
      generator.print(builtInScalarMap[finalType.name]);
    } else {
      context.addUsedType(finalType);
      generator.print(`Schema.${finalType.name}`);
    }
  } else if (finalType instanceof GraphQLEnumType) {
    context.addUsedType(finalType);
    generator.print(`Schema.${finalType.name}`);
  } else {
    const fieldObject = context.document.fieldObjectForField(field);
    generator.print(`${context.document.name}.${fieldObject.name}`);
  }

  generator.print(printAfter.reverse().join(''));
  generator.print(',');
}
