import {dirname, basename} from 'path';
import {
  GraphQLType,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} from 'graphql';

export type KeyPath = string;

export interface Fixture {
  path: string,
  content: any,
}

export interface Error {
  keyPath: KeyPath,
  message: string,
}

export interface AST {
  operations: {[key: string]: Operation},
  fragments: {[key: string]: FragmentSpread},
}

export interface Operation {
  fields: Field[],
}

export interface FragmentSpread {
  fields: Field[],
  typeCondition: GraphQLType,
  possibleTypes: GraphQLType[],
}

export interface Field {
  responseName: string,
  fieldName: string,
  type: GraphQLType,
  fields?: Field[],
  fragmentSpreads?: string[],
}

const OPERATION_MARKER = '@operation';

export default function validateValueAgainstAST(fixture: Fixture, ast: AST): Error[] {
  const queryName = basename(dirname(fixture.path));
  const query = ast.operations[queryName] || ast.operations[fixture.content[OPERATION_MARKER]];
  const {fields: [field]} = query;

  const value = {...fixture.content};
  delete value[OPERATION_MARKER];

  return validateValueAgainstFieldDescription(value[field.responseName], field, '', ast);
}

function validateValueAgainstFieldDescription(value: any, fieldDescription: Field, parentKeyPath: string, ast: AST): Error[] {
  const {type, responseName} = fieldDescription;
  const keyPath = updateKeyPath(parentKeyPath, responseName);
  const typeErrors = validateValueAgainstType(value, type, keyPath);

  if (typeErrors.length > 0) {
    return typeErrors;
  }
  
  return Array.isArray(value)
    ? validateListAgainstFieldDescription(value, fieldDescription, fieldDescription.type, keyPath, ast)
    : validateValueAgainstObjectFieldDescription(value, fieldDescription, keyPath, ast);
}

function validateValueAgainstObjectFieldDescription(value: any, fieldDescription: Field, keyPath: string, ast: AST) {
  if (typeof value !== 'object' || Array.isArray(value)) {
    return [];
  }

  const {fields = [], fragmentSpreads = [], type} = fieldDescription;

  let fragmentFields: Field[] = [];

  if (fragmentSpreads) {
    fragmentSpreads
      .map((spread) => ast.fragments[spread])
      .forEach((fragment) => {
        fragment.fields.forEach((field) => {
          if (fields.some(({fieldName}) => fieldName === field.fieldName)) {
            return;
          }

          const isGuaranteedTypeMatch = fragment.possibleTypes.includes(makeTypeNullable(type));

          fragmentFields.push(
            isGuaranteedTypeMatch
              ? field
              : {...field, type: makeTypeNullable(field.type)}
          );
        });
      });
  }

  return validateValueAgainstFields(value, fields.concat(fragmentFields), keyPath, ast);
}

function makeTypeNullable(type: GraphQLType) {
  return type instanceof GraphQLNonNull
    ? type.ofType
    : type;
}

function validateListAgainstFieldDescription(value: any[], fieldDescription: Field, type: GraphQLType, keyPath: string, ast: AST): Error[] {
  const itemType = type instanceof GraphQLNonNull
      ? (type as GraphQLNonNull<GraphQLList<GraphQLType>>).ofType.ofType
      : (type as GraphQLList<GraphQLType>).ofType;

  return value.reduce((allErrors, item, index) => {
    const itemKeyPath = updateKeyPath(keyPath, index);
    const itemTypeErrors = validateValueAgainstType(item, itemType, itemKeyPath);

    if (itemTypeErrors.length > 0) {
      return allErrors.concat(itemTypeErrors);
    }

    return Array.isArray(item)
      ? allErrors.concat(validateListAgainstFieldDescription(item, fieldDescription, itemType, itemKeyPath, ast))
      : allErrors.concat(validateValueAgainstObjectFieldDescription(item, fieldDescription, itemKeyPath, ast));
  }, []);
}

function validateValueAgainstFields(value: {[key: string]: any}, fields: Field[], keyPath: KeyPath, ast: AST) {
  const finalValue = value || {};

  const excessFields = Object
    .keys(finalValue)
    .filter((key) => fields.every(({responseName}) => key !== responseName))
    .map((key) => error(keyPath, `has key '${key}' not present in the query`));

  return fields.reduce((allErrors, field) => {
    return allErrors.concat(
      validateValueAgainstFieldDescription(finalValue[field.responseName], field, keyPath, ast)
    );
  }, excessFields);
}

function validateValueAgainstType(value: any, type: GraphQLType, keyPath: KeyPath): Error[] {
  if (type instanceof GraphQLNonNull) {
    return value == null
      ? [error(keyPath, `should be non-null but was ${String(value)}`)]
      : validateValueAgainstType(value, type.ofType, keyPath);
  }

  if (value == null) { return []; }

  const valueType = typeof value;

  if (type instanceof GraphQLObjectType) {
    return valueType === 'object'
      ? []
      : [error(keyPath, `should be an object but was a ${valueType}`)];
  }

  if (type instanceof GraphQLList) {
    if (!Array.isArray(value)) {
      return [error(keyPath, `should be an array, but was a ${valueType}`)];
    }

    return Array.isArray(value)
      ? []
      : [error(keyPath, `should be an array, but was a ${valueType}`)];
  }

  if (type === GraphQLString) {
    return valueType === 'string'
      ? []
      : [error(keyPath, `should be a string but was a ${valueType}`)];
  } else if (type === GraphQLInt) {
    if (typeof value === 'number') {
      return Number.isInteger(value)
        ? []
        : [error(keyPath, 'should be an integer but was a float')]
    }

    return [error(keyPath, `should be an integer but was a ${valueType}`)];
  } else if (type === GraphQLFloat) {
    if (typeof value === 'number') {
      return Number.isInteger(value)
        ? [error(keyPath, 'should be a float but was an integer')]
        : [];
    }

    return [error(keyPath, `should be a float but was a ${valueType}`)];
  } else if (type === GraphQLBoolean) {
    return typeof value === 'boolean'
      ? []
      : [error(keyPath, `should be a boolean but was a ${valueType}`)];
  }

  if (!(type instanceof GraphQLScalarType || type instanceof GraphQLEnumType)) {
    return [];
  }

  return type.parseValue(value) != null
    ? []
    : [error(keyPath, 'unable to parse value for type ${type.name}')];
}

function updateKeyPath(keyPath: KeyPath, newKey: string | number) {
  if (typeof newKey === 'number') {
    return `${keyPath}[${newKey}]`;
  }

  return keyPath ? `${keyPath}.${newKey}` : newKey;
}

function error(keyPath: KeyPath, message: string): Error {
  return {keyPath, message};
}
