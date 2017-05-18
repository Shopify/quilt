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
import {Operation, Fragment, AST, Field} from 'graphql-tool-utilities/ast';

import CodeGenerator from './generator';

type Block = () => void;

interface ImportMap {
  [key: string]: string[],
}

interface Interface {
  name: string,
  extend?: string[],
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

class SpecialType {
  constructor(public typeName: string, public print: (generator: CodeGenerator) => void) {}
}

const NULLABLE_FRAGMENT = new SpecialType('NullableFragment', (generator) => {
  generator.printOnNewline('type NullableFragment<T> = ');
  generator.withinBlock(() => {
    printPropertyKey('[P in keyof T]', true, generator);
    generator.print('T[P] | null');
  });
  generator.printNewline();
});

class Context {
  typesUsed = new Set<GraphQLInputType>();
  specialTypesUsed = new Set<SpecialType>();

  constructor(public ast: AST) {}

  addSpecialType(type: SpecialType) {
    this.specialTypesUsed.add(type);
  }

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
  {operation, fragment}: File,
  ast: AST,
) {
  if (operation == null && fragment == null) {
    return '';
  }

  const generator = new CodeGenerator();
  const context = new Context(ast);

  generator.printOnNewline('// This file was generated and should not be edited.');
  generator.printOnNewline('// tslint-disable');
  generator.printNewline();
  generator.printOnNewline("import {DocumentNode} from 'graphql';");
  generator.printNewline();

  const subGenerator = new CodeGenerator();

  if (operation != null) {
    printImportsForDocument(operation, generator, context);
    printVariablesInterfaceFromOperation(operation, subGenerator, context);
    printInterfaceFromOperation(subGenerator, operation, context);
  }

  if (fragment != null) {
    printImportsForDocument(fragment, subGenerator, context);
    printInterfaceFromFragment(fragment, subGenerator, context);
  }

  Array.from(context.specialTypesUsed).reverse().forEach((type) => {
    type.print(generator);
  });

  Array.from(context.typesUsed).reverse().forEach((type) => {
    printRootGraphQLType(type, generator);
  });

  generator.printOnNewline(subGenerator.output);

  generator.printOnNewline('declare const document: DocumentNode;');
  generator.printOnNewline('export default document;');
  generator.printNewline();

  generator.printOnNewline('// tslint-enable');

  return generator.output;
}

function printImportsForDocument(
  {fragmentsReferenced, filePath}: Operation | Fragment,
  generator: CodeGenerator,
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
    generator.printNewline();
  });
}

function printVariablesInterfaceFromOperation(
  {operationName, variables}: Operation,
  generator: CodeGenerator,
  context: Context,
) {
  if (variables.length === 0) { return; }

  printExport(() => {
    printInterface({
      name: `${operationName}QueryVariables`,
    }, () => {
      variables.forEach(({name, type}) => {
        context.addType(type);
        printInputGraphQLField(name, type, generator);
      });
    }, generator);
  }, generator);
}

function printInputGraphQLField(
  name: string,
  type: GraphQLInputType,
  generator: CodeGenerator,
) {
  printPropertyKey(name, !(type instanceof GraphQLNonNull), generator);
  printInputGraphQLType(type, generator);
  generator.print(',');
}

function printInputGraphQLType(
  type: GraphQLInputType,
  generator: CodeGenerator,
) {
  let nullable = true;

  if (type instanceof GraphQLNonNull) {
    nullable = false;
    type = type.ofType;
  }
  
  if (type instanceof GraphQLList) {
    const subType = type.ofType;

    if (subType instanceof GraphQLNonNull) {
      printInputGraphQLType(type.ofType, generator);
    } else {
      generator.print('(');
      printInputGraphQLType(type.ofType, generator);
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
  type: GraphQLType,
  generator: CodeGenerator,
) {
  if (type instanceof GraphQLInputObjectType) {
    printInterface({name: type.name}, () => {
      const fields = (type as GraphQLInputObjectType).getFields();
      Object.keys(fields).forEach((name) => {
        const field = fields[name];
        printInputGraphQLField(name, field.type, generator);
      });
    }, generator);
  } else if (type instanceof GraphQLEnumType) {
    const values = type.getValues();
    generator.printOnNewline(`type ${type.name} = `);
    values.forEach((value, index) => {
      generator.print(`'${value.value}'`);
      generator.print(index !== values.length - 1 && ' | ');
    });
    generator.print(';');
    generator.printNewline();
  } else if (type instanceof GraphQLScalarType) {
    generator.printOnNewline(`type ${type.name} = string;`);
    generator.printNewline();
  }
}

function printInterfaceFromFragment(
  fragment: Fragment,
  generator: CodeGenerator,
  context: Context,
) {
  const {
    fragmentName,
    fields,
    fragmentSpreads,
  } = fragment;

  generator.printNewline();

  printExport(() => {
    printInterface({
      name: fragmentName,
      extend: fragmentSpreads,
    }, () => {
      fields.forEach((field) => printField(field, false, generator, context));
    }, generator);
  }, generator);
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

  printExport(() => {
    printInterface({
      name: `${operationName}Query`,
      extend: fragmentSpreads,
    }, () => {
      fields.forEach((field) => {
        printField(field, false, generator, context);
      });
    }, generator);
  }, generator);
}

type GraphQLPrintableType = GraphQLLeafType | GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;

function printField(
  {responseName, type, fields = [], fragmentSpreads = [], inlineFragments = []}: Field,
  forceNullable = false,
  generator: CodeGenerator,
  context: Context,
) {
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
    fragmentSpreads.forEach((spread) => {
      const fragment = context.ast.fragments[spread];
      
      let {fragmentName} = fragment;
      if (fragment.typeCondition !== finalType) {
        context.addSpecialType(NULLABLE_FRAGMENT);
        fragmentName = `${NULLABLE_FRAGMENT.typeName}<${fragmentName}>`;
      }

      generator.print(`${fragmentName} & `);
    });

    generator.withinBlock(() => {
      const seenFields = new Set<string>();

      fields.forEach((field) => {
        seenFields.add(field.responseName);
        printField(field, false, generator, context);
      });

      inlineFragments.forEach((fragment) => {
        fragment.fields.forEach((field) => {
          if (seenFields.has(field.responseName)) { return; }

          // If it's not on `fields`, there is no guaranteed match, so we need
          // to say that it can be nullable
          printField(field, true, generator, context);
        });
      });
    });
  }

  generator.print(printAfter.reverse().join(''));
  generator.print(',');
}

function printPropertyKey(
  name: string,
  nullable: boolean,
  generator: CodeGenerator,
) {
  generator.printOnNewline(name);
  generator.print(nullable && '?');
  generator.print(': ');
}

function printExport(exported: Block, generator: CodeGenerator) {
  generator.printNewlineIfNeeded();
  generator.printAndForceInline('export ');
  exported();
}

function printInterface(
  {name, extend = []}: Interface,
  body: Block,
  generator: CodeGenerator,
) {
  generator.printOnNewline(`interface ${name} `);

  if (extend.length) {
    generator.print(`extends ${extend.join(', ')} `);
  }

  generator.withinBlock(body);
  generator.printNewline();
}
