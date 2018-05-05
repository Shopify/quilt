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

import CodeGenerator from './generator';
import {printPropertyKey, printInterface} from './language';

export type GraphQLPrintableType = GraphQLLeafType | GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;

export const builtInScalarMap = {
  [GraphQLString.name]: 'string',
  [GraphQLInt.name]: 'number',
  [GraphQLFloat.name]: 'number',
  [GraphQLBoolean.name]: 'boolean',
  [GraphQLID.name]: 'string',
}

export function printInputGraphQLField(
  name: string,
  type: GraphQLInputType | undefined,
  generator: CodeGenerator,
) {
  if (type === undefined || getRootGraphQLType(type) === undefined) {
    throw new Error(`An invalid type was provided for key '${name}'. This probably means there is a typo in your document or that one of your input types has been renamed.`);
  }

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
  } else if (builtInScalarMap.hasOwnProperty((type as any).name)) {
    generator.print(builtInScalarMap[(type as any).name]);
  } else {
    generator.print(`Schema.${(type as any).name}`);
  }

  generator.print(nullable && ' | null');
}

export function printRootGraphQLType(
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
    generator.print(`type ${type.name} = `);
    values.forEach((value, index) => {
      generator.print(`'${value.value}'`);
      generator.print(index !== values.length - 1 && ' | ');
    });
    generator.print(';');
  } else if (type instanceof GraphQLScalarType) {
    generator.print(`type ${type.name} = string;`);
  }
}

export function getRootGraphQLType(type: GraphQLType): GraphQLPrintableType {
  let finalType = type;

  while (finalType instanceof GraphQLNonNull || finalType instanceof GraphQLList) {
    finalType = finalType.ofType;
  }

  return finalType as GraphQLPrintableType;
}
