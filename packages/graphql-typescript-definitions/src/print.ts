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
import {Type, Property, Interface} from './intermediate';

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

class Context {
  typesUsed = new Set<GraphQLInputType>();

  constructor(public ast: AST) {}

  addType(type: GraphQLType) {
    const {typesUsed} = this;

    if (typesUsed.has(type as GraphQLInputType)) { return; }

    if (type instanceof GraphQLEnumType) {
      typesUsed.add(type);
    } else if (type instanceof GraphQLInputObjectType) {
      typesUsed.add(type);

      const fields = type.getFields();
      Object
        .keys(fields)
        .map((fieldName) => fields[fieldName])
        .forEach((typeField) => this.addType(typeField.type));
    } else if (type instanceof GraphQLScalarType && !builtInScalarMap.hasOwnProperty(type.name)) {
      typesUsed.add(type);
    } else if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
      this.addType(type.ofType);
    }
  }
}

export function printFile(
  generator: CodeGenerator,
  {operation, fragment}: File,
  ast: AST,
) {
  if (operation == null && fragment == null) {
    return '';
  }

  const context = new Context(ast);

  generator.printOnNewline('// This file was generated and should not be edited.');
  generator.printOnNewline('// tslint-disable');
  generator.printNewline();
  generator.printOnNewline("import {DocumentNode} from 'graphql';");
  generator.printNewline();

  const subGenerator = new CodeGenerator();

  if (operation != null) {
    printImportsForDocument(subGenerator, operation, context);
    printVariablesInterfaceFromOperation(subGenerator, operation, context);
    printInterfaceFromOperation(subGenerator, operation, context);
  }

  if (fragment != null) {
    printImportsForDocument(subGenerator, fragment, context);
    printInterfaceFromFragment(subGenerator, fragment, context);
  }

  Array.from(context.typesUsed).reverse().forEach((type) => {
    generator.printNewline();
    printRootGraphQLType(generator, type);
  });

  generator.printOnNewline(subGenerator.output);

  generator.printOnNewline('declare const document: DocumentNode;');
  generator.printOnNewline('export default document;');
  generator.printNewline();

  generator.printOnNewline('// tslint-enable');

  return generator.output;
}

function printImportsForDocument(
  generator: CodeGenerator,
  {fragmentsReferenced, filePath}: Operation | Fragment,
  context: Context,
) {
  const {ast} = context;
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

function printVariablesInterfaceFromOperation(
  generator: CodeGenerator,
  {operationName, variables}: Operation,
  context: Context,
) {
  printExport(generator, () => {
    printInterface(generator, {
      name: `${operationName}Variables`,
    }, () => {
      variables.forEach(({name, type}) => {
        context.addType(type);
        printInputGraphQLField(generator, name, type);
      });
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

function printInputGraphQLType(
  generator: CodeGenerator,
  type: GraphQLInputType,
) {
  let nullable = true;

  if (type instanceof GraphQLNonNull) {
    nullable = false;
    type = type.ofType;
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

function printRootGraphQLType(
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

function printInterfaceFromFragment(
  generator: CodeGenerator,
  fragment: Fragment,
  context: Context,
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
      fields.forEach((field) => printField(generator, field, context));
    });
  });

  generator.printNewline();
}

function printInterfaceFromOperation(
  generator: CodeGenerator,
  operation: Operation,
  context: Context,
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
        printField(generator, field, context);
      });
    });
  });

  generator.printNewline();
}

type GraphQLPrintableType = GraphQLLeafType | GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;

function printField(
  generator: CodeGenerator,
  {responseName, type, fields = [], fragmentSpreads = [], inlineFragments = []}: Field,
  context: Context,
  forceNullable = false,
) {
  let currentType = type;
  const nullable = forceNullable || !(currentType instanceof GraphQLNonNull);
  const printBefore: string[] = [];
  const printAfter: string[] = nullable ? [' | null'] : [];

  printPropertyKey(generator, responseName, nullable);

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

  if (fragmentSpreads.length && printAfter.length) {
    printBefore.push('(');
    printAfter.push(')');
  }

  generator.print(printBefore.join(''));

  if (finalType instanceof GraphQLScalarType) {
    if (builtInScalarMap.hasOwnProperty(finalType.name)) {
      generator.print(builtInScalarMap[finalType.name]);
    } else {
      context.addType(finalType);
      generator.print(finalType.name);
    }
  } else if (finalType instanceof GraphQLEnumType) {
    context.addType(finalType);
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
        printField(generator, field, context);
      });

      inlineFragments.forEach((fragment) => {
        fragment.fields.forEach((field) => {
          if (seenFields.has(field.responseName)) { return; }

          // If it's not on `fields`, there is no guaranteed match, so we need
          // to say that it can be nullable
          printField(generator, field, context, true);
        });
      });
    });
  }

  generator.print(printAfter.reverse().join(''));
  generator.print(',');
}

function printPropertyKey(generator: CodeGenerator, name: string, nullable: boolean) {
  generator.printOnNewline(name);
  generator.print(nullable && '?');
  generator.print(': ');
}

function printExport(generator: CodeGenerator, exported: Block) {
  generator.printOnNewline('export ');
  exported();
}

function printInterface(generator: CodeGenerator, {name, extend = []}: Interface, body: Block) {
  generator.print(`interface ${name} `);

  if (extend.length) {
    generator.print(`extends ${extend.join(', ')} `);
  }

  generator.withinBlock(body);
}
