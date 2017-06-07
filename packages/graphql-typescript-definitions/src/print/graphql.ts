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
} from 'graphql';

import CodeGenerator from './generator';
import {printPropertyKey, printInterface} from './language';

export const builtInScalarMap = {
  [GraphQLString.name]: 'string',
  [GraphQLInt.name]: 'number',
  [GraphQLFloat.name]: 'number',
  [GraphQLBoolean.name]: 'boolean',
  [GraphQLID.name]: 'string',
}

export function printInputGraphQLField(
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
    generator.printOnNewline(`export type ${type.name} = `);
    values.forEach((value, index) => {
      generator.print(`'${value.value}'`);
      generator.print(index !== values.length - 1 && ' | ');
    });
    generator.print(';');
  } else if (type instanceof GraphQLScalarType) {
    generator.printOnNewline(`export type ${type.name} = string;`);
  }
}
