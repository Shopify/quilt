import {dirname, basename} from 'path';
import {
  GraphQLSchema,
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
import {AST, Field} from 'graphql-tool-utilities/ast';

export type KeyPath = string;

export interface Fixture {
  path: string,
  content: any,
}

export interface Error {
  keyPath?: KeyPath,
  message: string,
}

export interface Validation {
  fixturePath: string,
  operationName?: string,
  operationType?: 'query' | 'mutation',
  operationPath?: string,
  validationErrors: Error[],
}

const OPERATION_MARKER = '@operation';

export function validateFixtureAgainstSchema(fixture: Fixture, schema: GraphQLSchema): Validation {
  const queryType = schema.getQueryType();
  const mutationType = schema.getMutationType();
  const {content, path} = fixture;

  return {
    fixturePath: path,
    validationErrors: Object.keys(content).reduce((allErrors: Error[], key) => {
      let rootType: GraphQLObjectType;
      const keyPath = key;
      
      if (key === OPERATION_MARKER) {
        return allErrors;
      }

      if (objectTypeHasFieldWithName(queryType, key)) {
        rootType = queryType;
      } else if (objectTypeHasFieldWithName(mutationType, key)) {
        rootType = mutationType;
      } else {
        return allErrors.concat([error(keyPath, 'Field does not exist on query or mutation types')]);
      }

      return allErrors.concat(validateValueAgainstType(content[key], rootType.getFields()[key].type, keyPath));
    }, []),
  };
}

function objectTypeHasFieldWithName(type: GraphQLObjectType, name: string) {
  return type.getFields().hasOwnProperty(name);
}

export function validateFixtureAgainstAST(fixture: Fixture, ast: AST): Validation {
  const fixtureDirectoryName = basename(dirname(fixture.path));
  const operationName = fixture.content[OPERATION_MARKER] || fixtureDirectoryName;
  const operation = ast.operations[operationName];

  if (operation == null) {
    let lookedFor = `'${fixtureDirectoryName}' based on the fixture’s directory name`
    
    if (fixture.content[OPERATION_MARKER]) {
      lookedFor += `, and '${fixture.content[OPERATION_MARKER]}' based on the '${OPERATION_MARKER}' key`;
    }

    throw new Error([
      `Could not find a matching operation (looked for ${lookedFor}).`,
      `Make sure to put your fixture in a folder named the same as the operation, or add an '${OPERATION_MARKER}' key indicating the operation.`,
      `Available operations: ${Object.keys(ast.operations).join(', ')}`
    ].join(' '));
  }

  const {fields, filePath, operationType} = operation;
  const value = {...fixture.content};
  delete value[OPERATION_MARKER];

  return {
    fixturePath: fixture.path,
    operationName,
    operationType,
    operationPath: filePath,
    validationErrors: fields.reduce((allErrors: Error[], field) => {
      return allErrors.concat(
        validateValueAgainstFieldDescription(value[field.responseName], field, '', ast)
      );
    }, []),
  };
}

function validateValueAgainstFieldDescription(value: any, fieldDescription: Field, parentKeyPath: string, ast: AST): Error[] {
  const {type, responseName} = fieldDescription;
  const keyPath = updateKeyPath(parentKeyPath, responseName);
  const typeErrors = validateValueAgainstType(value, type, keyPath, {shallow: true});

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
    const itemTypeErrors = validateValueAgainstType(item, itemType, itemKeyPath, {shallow: true});

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

interface TypeValidationOptions {
  shallow: boolean,
}

function validateValueAgainstType(value: any, type: GraphQLType, keyPath: KeyPath, options: TypeValidationOptions = {shallow: false}): Error[] {
  const {shallow} = options;

  if (type instanceof GraphQLNonNull) {
    return value == null
      ? [error(keyPath, `should be non-null but was ${String(value)}`)]
      : validateValueAgainstType(value, type.ofType, keyPath, options);
  }

  if (value == null) { return []; }

  const valueType = typeof value;

  if (type instanceof GraphQLObjectType) {
    if (valueType === 'object') {
      if (shallow) {
        return [];
      } else {
        const fields = type.getFields();
        return Object.keys(value).reduce((fieldErrors: Error[], key) => {
          const fieldKeyPath = updateKeyPath(keyPath, key);

          if (fields.hasOwnProperty(key)) {
            return fieldErrors.concat(validateValueAgainstType(value[key], fields[key].type, fieldKeyPath, options));
          } else {
            return fieldErrors.concat([error(fieldKeyPath, `does not exist on type ${type.name} (available fields: ${Object.keys(fields).join(', ')})`)]);
          }
        }, []);
      }
    } else {
      return [error(keyPath, `should be an object but was a ${valueType}`)];
    }
  }

  if (type instanceof GraphQLList) {
    if (!Array.isArray(value)) {
      return [error(keyPath, `should be an array, but was a ${valueType}`)];
    }

    return shallow
      ? []
      : value.reduce((allErrors: Error[], item, index) => (
        allErrors.concat(validateValueAgainstType(item, type.ofType, updateKeyPath(keyPath, index), options))
      ), []);
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

  if (type instanceof GraphQLScalarType) {
    return type.parseValue(value) != null
      ? []
      : [error(keyPath, `value does not match scalar ${type.name}`)];
  }

  if (type instanceof GraphQLEnumType) {
    return type.parseValue(value) != null
      ? []
      : [error(keyPath, `value does not match enum ${type.name} (available values: ${type.getValues().map((enumValue) => enumValue.value).join(', ')})`)];
  }

  return [];
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
