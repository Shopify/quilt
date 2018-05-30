import * as t from '@babel/types';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID,
} from 'graphql';

export const scalarTypeMap = {
  [GraphQLString.name]: t.tsStringKeyword(),
  [GraphQLInt.name]: t.tsNumberKeyword(),
  [GraphQLFloat.name]: t.tsNumberKeyword(),
  [GraphQLBoolean.name]: t.tsBooleanKeyword(),
  [GraphQLID.name]: t.tsStringKeyword(),
};
