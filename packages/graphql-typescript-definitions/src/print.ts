import {relative, dirname} from 'path';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID,
  GraphQLType,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLLeafType,
} from 'graphql';
import {Operation, Fragment, AST, Field, Variable} from 'graphql-tool-utilities/ast';

import CodeGenerator from './generator';
import {propertiesFromFields, Type, Property, Interface} from './intermediate';

type Block = () => void;

interface ImportMap {
  [key: string]: string[],
}

interface File {
  path: string,
  operation?: Operation,
  fragment?: Fragment,
}

const builtInScalarMap = {
  [GraphQLString.name]: 'string',
  [GraphQLInt.name]: 'number',
  [GraphQLFloat.name]: 'number',
  [GraphQLBoolean.name]: 'boolean',
  [GraphQLID.name]: 'string',
}

export function printFile(
  generator: CodeGenerator,
  {operation, fragment}: File,
  ast: AST,
) {
  if (operation == null && fragment == null) {
    return '';
  }

  generator.printOnNewline('// This file was generated and should not be edited.');
  generator.printOnNewline('// tslint-disable');
  generator.printNewline();
  generator.printOnNewline("import {DocumentNode} from 'graphql';");
  generator.printNewline();

  if (operation != null) {
    printImportsForOperation(generator, operation, ast);
    printVariablesInterfaceFromOperation(generator, operation);
    printInterfaceFromOperation(generator, operation, ast);
  }

  if (fragment != null) {
    printImportsForOperation(generator, fragment, ast);
    printInterfaceFromFragment(generator, fragment, ast);
  }

  generator.printOnNewline('declare const document: DocumentNode;');
  generator.printOnNewline('export default document;');
  generator.printNewline();

  generator.printOnNewline('// tslint-enable');

  return generator.output;
}

export function printImportsForOperation(
  generator: CodeGenerator,
  {fragmentsReferenced, filePath}: Operation | Fragment,
  ast: AST,
) {
  const fragmentImports = fragmentsReferenced.reduce((imports: ImportMap, fragmentName) => {
    const fragment = ast.fragments[fragmentName];
    const fileImports = imports[fragment.filePath] || [];

    fileImports.push(fragmentName);
    imports[fragment.filePath] = fileImports;

    return imports;
  }, {} as ImportMap);

  Object.keys(fragmentImports).forEach((fragmentFilePath) => {
    const fragmentsToImport = fragmentImports[fragmentFilePath];

    let relativePath = relative(dirname(filePath), fragmentFilePath);
    if (!relativePath.startsWith('.')) {
      relativePath = `./${relativePath}`;
    }

    generator.printOnNewline(`import {${fragmentsToImport.join(', ')}} from '${relativePath}';`);
  });

  if (Object.keys(fragmentImports).length) {
    generator.printNewline();
  }
}

export function printVariablesInterfaceFromOperation(
  generator: CodeGenerator,
  operation: Operation,
) {
  const {operationName, variables, fields} = operation;

  const types = new Set();

  function addFieldTypesToList({type, fields = [], fragmentSpreads, inlineFragments = []}: Field) {
    addTypeToList(type);
    fields.forEach(addFieldTypesToList);
    inlineFragments.forEach((fragment) => {
      fragment.fields.forEach(addFieldTypesToList);
    })
  }

  function addVariableTypesToList({type}: Variable) {
    addTypeToList(type);
  }

  function addTypeToList(type: GraphQLType) {
    if (types.has(type)) { return; }

    if (type instanceof GraphQLEnumType) {
      types.add(type);
    } else if (type instanceof GraphQLInputObjectType) {
      types.add(type);

      const fields = type.getFields();
      Object
        .keys(fields)
        .map((fieldName) => fields[fieldName])
        .forEach((typeField) => addTypeToList(typeField.type));
    } else if (type instanceof GraphQLScalarType && !builtInScalarMap.hasOwnProperty(type.name)) {
      types.add(type);
    } else if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
      addTypeToList(type.ofType);
    }
  }

  variables.forEach(addVariableTypesToList);
  fields.forEach(addFieldTypesToList);

  Array.from(types).reverse().forEach((type) => {
    generator.printNewline();
    printRootGraphQLType(generator, type);
  });

  printExport(generator, () => {
    printInterface(generator, {
      name: `${operationName}Variables`,
    }, () => {
      variables.forEach((variable) => printInputGraphQLField(generator, variable.name, variable.type));
    });
  });

  generator.printNewline();
}

function printInputGraphQLField(
  generator: CodeGenerator,
  name: string,
  type: GraphQLInputType,
) {
  printPropertyKey(generator, name, !(type instanceof GraphQLNonNull));
  printInputGraphQLType(generator, type);
  generator.print(',');
}

export function printInputGraphQLType(
  generator: CodeGenerator,
  type: GraphQLInputType,
  nullable = true,
) {
  if (type instanceof GraphQLNonNull) {
    printInputGraphQLType(generator, type.ofType, false);
    return;
  }
  
  if (type instanceof GraphQLList) {
    const subType = type.ofType;

    if (subType instanceof GraphQLNonNull) {
      printInputGraphQLType(generator, type.ofType);
    } else {
      generator.print('(');
      printInputGraphQLType(generator, type.ofType);
      generator.print(')');
    }

    generator.print('[]');
  } else if (builtInScalarMap.hasOwnProperty(type.name)) {
    generator.print(builtInScalarMap[type.name]);
  } else {
    generator.print(type.name);
  }

  generator.print(nullable && ' | null');
}

export function printRootGraphQLType(
  generator: CodeGenerator,
  type: GraphQLType,
) {
  if (type instanceof GraphQLInputObjectType) {
    printInterface(generator, {name: type.name}, () => {
      const fields = (type as GraphQLInputObjectType).getFields();
      Object.keys(fields).forEach((name) => {
        const field = fields[name];
        printInputGraphQLField(generator, name, field.type);
      });
    });
    generator.printNewline();
  } else if (type instanceof GraphQLEnumType) {
    const values = type.getValues();
    generator.print(`type ${type.name} = `);
    values.forEach((value, index) => {
      generator.print(`'${value.value}'`);
      generator.print(index !== values.length - 1 && ' | ');
    });
    generator.print(';');
    generator.printNewline();
  } else if (type instanceof GraphQLScalarType) {
    generator.print(`type ${type.name} = string;`);
    generator.printNewline();
  }
}

export function printInterfaceFromFragment(
  generator: CodeGenerator,
  fragment: Fragment,
  ast: AST,
) {
  const {
    fragmentName,
    fields,
    fragmentSpreads,
  } = fragment;

  printExport(generator, () => {
    printInterface(generator, {
      name: fragmentName,
      extend: fragmentSpreads,
    }, () => {
      propertiesFromFields(ast, fields).forEach((property) => printProperty(generator, property));
    });
  });

  generator.printNewline();
}

export function printInterfaceFromOperation(
  generator: CodeGenerator,
  operation: Operation,
  ast: AST,
) {
  const {
    fields,
    operationName,
    fragmentSpreads,
  } = operation;

  printExport(generator, () => {
    printInterface(generator, {
      name: operationName,
      extend: fragmentSpreads,
    }, () => {
      fields.forEach((field) => {
        printField(generator, field, ast);
      });
    });
  });

  generator.printNewline();
}

type GraphQLPrintableType = GraphQLLeafType | GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;

function printField(
  generator: CodeGenerator,
  {responseName, type, fields = [], fragmentSpreads = [], inlineFragments = []}: Field,
  ast: AST,
  forceNullable = false,
) {
  let currentType = type;
  const nullable = forceNullable || !(currentType instanceof GraphQLNonNull);
  const printBefore: string[] = [];
  const printAfter: string[] = nullable ? [' | null'] : [];

  printPropertyKey(generator, responseName, nullable);

  if (currentType instanceof GraphQLList) {
    currentType = currentType.ofType;

    if (currentType instanceof GraphQLNonNull) {
      printAfter.push('[]');
      currentType = currentType.ofType;
    } else {
      printBefore.push('(');
      printAfter.push(' | null)[]');
    }
  } else if (currentType instanceof GraphQLNonNull) {
    currentType = currentType.ofType;
    
    if (currentType instanceof GraphQLList) {
      currentType = currentType.ofType;

      if (currentType instanceof GraphQLNonNull) {
        printAfter.push('[]');
        currentType = currentType.ofType;
      } else {
        printBefore.push('(');
        printAfter.push(' | null)[]');
      }
    }
  }

  const finalType = currentType as GraphQLPrintableType;

  if (fragmentSpreads.length && printAfter.length) {
    printBefore.push('(');
    printAfter.push(')');
  }

  generator.print(printBefore.join(''));

  if (finalType instanceof GraphQLScalarType) {
    if (builtInScalarMap.hasOwnProperty(finalType.name)) {
      generator.print(builtInScalarMap[finalType.name]);
    } else {
      generator.print(finalType.name);
    }
  } else if (finalType instanceof GraphQLEnumType) {
    generator.print(finalType.name);
  } else {
    if (fragmentSpreads.length) {
      generator.print(fragmentSpreads.join(' & '));
      generator.print(' & ');
    }

    generator.withinBlock(() => {
      const seenFields = new Set<string>();

      fields.forEach((field) => {
        seenFields.add(field.responseName);
        printField(generator, field, ast);
      });

      inlineFragments.forEach((fragment) => {
        fragment.fields.forEach((field) => {
          if (seenFields.has(field.responseName)) { return; }

          // If it's not on `fields`, there is no guaranteed match, so we need
          // to say that it can be nullable
          printField(generator, field, ast, true);
        });
      });
    });
  }

  generator.print(printAfter.reverse().join(''));
  generator.print(',');
}

export function printPropertyKey(generator: CodeGenerator, name: string, nullable: boolean) {
  generator.printOnNewline(name);
  generator.print(nullable && '?');
  generator.print(': ');
}

export function printProperty(generator: CodeGenerator, {type, name}: Property) {
  generator.printOnNewline(`${name}: `);
  printType(generator, type);
  generator.print(',');
}

export function printType(generator: CodeGenerator, {name, types, array, nullable, properties}: Type) {
  const hasMultipleTypes = (types != null) && (types.length > 1);
  const needsParens = (array && (hasMultipleTypes || (types != null && types.length > 0 && types[0].nullable)));

  generator.print(needsParens && '(');

  if (types && types.length) {
    types.forEach((type, index) => {
      printType(generator, type);
      generator.print(index !== types.length - 1 && ' & ');
    });
  } else if (properties && properties.length) {
    generator.withinBlock(() => {
      properties.forEach((property) => {
        printProperty(generator, property);
      });
    });
  } else if (name) {
    generator.print(name);
  }

  generator.print(needsParens && ')');
  generator.print(array && '[]');
  generator.print(nullable && ' | null');
}

export function printExport(generator: CodeGenerator, exported: Block) {
  generator.printOnNewline('export ');
  exported();
}

export function printInterface(generator: CodeGenerator, {name, extend = []}: Interface, body: Block) {
  generator.print(`interface ${name} `);

  if (extend.length) {
    generator.print(`extends ${extend.join(', ')} `);
  }

  generator.withinBlock(body);
}
