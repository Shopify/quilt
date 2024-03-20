import {dirname, basename} from 'path';

import type {
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLLeafType,
} from 'graphql';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  isEnumType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
} from 'graphql';
import type {GraphQLProjectConfig} from 'graphql-config';
import type {AST, Field, Operation} from 'graphql-tool-utilities';

export type KeyPath = string;

export interface Fixture {
  path: string;
  content: any;
}

export interface Error {
  keyPath?: KeyPath;
  message: string;
}

export interface GraphQLProjectAST {
  config: GraphQLProjectConfig;
  ast: AST;
}

export interface FoundOperation {
  lookForOperationName: string;
  operation: Operation;
  projectAST: GraphQLProjectAST;
}

export class MissingOperationError extends Error {
  constructor(
    {path}: Fixture,
    lookForOperationNames: string[],
    projectASTCollection: GraphQLProjectAST[],
  ) {
    super(
      [
        `Could not find a matching operation for '${path}'`,
        `(looked for ${lookForOperationNames.join(', ')}).`,
        `Make sure to put your fixture in a folder named the same as the operation,`,
        `or add an '${OPERATION_MARKER}' key indicating the operation.`,
        `Available operations: ${projectASTCollection
          .flatMap(({ast: {operations}}) => Object.keys(operations))
          .join(', ')}`,
      ].join(' '),
    );
  }
}

export class AmbiguousOperationNameError extends Error {
  constructor({path}: Fixture, foundOperations: FoundOperation[]) {
    super(
      [
        `Ambiguous operation name found for '${path}'`,
        `(found ${Array.from(
          new Set(
            foundOperations.map(
              ({lookForOperationName}) => lookForOperationName,
            ),
          ),
        ).join(', ')})`,
        `in projects:`,
        `${foundOperations
          .map(({projectAST: {config}}) => config.name)
          .join(', ')}.`,
        `Try renaming the operation in one of the projects listed and updating`,
        `the fixture folder name or use an '${OPERATION_MARKER}' key indicating`,
        `the new operation name.`,
      ].join(' '),
    );
  }
}

export interface Validation {
  fixturePath: string;
  operationName?: string;
  operationType?: string;
  operationPath?: string;
  validationErrors: Error[];
}

const OPERATION_MARKER = '@operation';

function normalizeOperationName(operationName: string): string;
function normalizeOperationName(
  operationName: string | undefined,
): string | undefined;
function normalizeOperationName(operationName: string | undefined) {
  return operationName
    ? operationName.replace(/(Query|Mutation|Subscription)$/i, '')
    : undefined;
}

export function getOperationNames(fixture: Fixture): string[] {
  const fixtureDirectoryName = basename(dirname(fixture.path));
  const operationMarkerName: string | undefined =
    fixture.content[OPERATION_MARKER];

  return Array.from(
    new Set([
      fixtureDirectoryName,
      operationMarkerName,
      normalizeOperationName(fixtureDirectoryName),
      normalizeOperationName(operationMarkerName),
    ]),
  ).filter(
    (operationName): operationName is string =>
      typeof operationName === 'string',
  );
}

export function findOperations(
  lookForOperationNames: string[],
  projectASTCollection: GraphQLProjectAST[],
) {
  return projectASTCollection
    .map<FoundOperation | null>((projectAST) => {
      for (const lookForOperationName of lookForOperationNames) {
        const operation = projectAST.ast.operations[lookForOperationName];

        if (operation) {
          return {
            lookForOperationName,
            operation,
            projectAST,
          };
        }
      }

      return null;
    })
    .filter((match): match is FoundOperation => Boolean(match));
}

export function getOperationForFixture(
  fixture: Fixture,
  projectASTCollection: GraphQLProjectAST[],
) {
  const lookForOperationNames = getOperationNames(fixture);
  const operations = findOperations(
    lookForOperationNames,
    projectASTCollection,
  );

  if (operations.length === 0) {
    throw new MissingOperationError(
      fixture,
      lookForOperationNames,
      projectASTCollection,
    );
  }

  if (operations.length > 1) {
    throw new AmbiguousOperationNameError(fixture, operations);
  }

  return operations[0];
}

export interface FixtureOperation {
  fixture: Fixture;
  operation: Operation;
  operationName: string;
}

export function validateFixture(
  fixture: Fixture,
  ast: AST,
  operation: Operation,
): Validation {
  const {fields = [], filePath, operationType} = operation;
  const value = {...fixture.content};
  delete value[OPERATION_MARKER];

  return {
    fixturePath: fixture.path,
    operationName: operation.operationName,
    operationType,
    operationPath: filePath === 'GraphQL request' ? undefined : filePath,
    validationErrors: fields.reduce((allErrors: Error[], field) => {
      return allErrors.concat(
        validateValueAgainstFieldDescription(
          value[field.responseName],
          field,
          '',
          ast,
        ),
      );
    }, []),
  };
}

function validateValueAgainstFieldDescription(
  value: any,
  fieldDescription: Field,
  parentKeyPath: string,
  ast: AST,
): Error[] {
  const {type, responseName} = fieldDescription;
  const keyPath = updateKeyPath(parentKeyPath, responseName);
  const typeErrors = validateValueAgainstType(value, type, keyPath, {
    shallow: true,
  });

  if (typeErrors.length > 0) {
    return typeErrors;
  }

  return Array.isArray(value)
    ? validateListAgainstFieldDescription(
        value,
        fieldDescription,
        type as GraphQLList<GraphQLType>,
        keyPath,
        ast,
      )
    : validateValueAgainstObjectFieldDescription(
        value,
        fieldDescription,
        keyPath,
        ast,
      );
}

function validateValueAgainstObjectFieldDescription(
  value: any,
  fieldDescription: Field,
  keyPath: string,
  ast: AST,
) {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return [];
  }

  const {
    fields: currentValueFields = [],
    fragmentSpreads = [],
    inlineFragments = [],
    type: currentValueType,
  } = fieldDescription;

  const fragmentSpreadFields: Field[] = [];
  const inlineFragmentFields: Field[] = [];

  if (fragmentSpreads.length !== 0) {
    fragmentSpreadFields.push(
      ...getFragmentSpreadsFields(
        fragmentSpreads,
        currentValueFields,
        currentValueType,
        value,
        ast,
      ),
    );
  }

  if (inlineFragments.length !== 0) {
    inlineFragmentFields.push(
      ...getInlineFragmentsFields(
        inlineFragments,
        currentValueFields,
        currentValueType,
        value,
        ast,
      ),
    );
  }

  return validateValueAgainstFields(
    value,
    currentValueFields.concat(fragmentSpreadFields, inlineFragmentFields),
    keyPath,
    ast,
  );
}

function getInlineFragmentsFields(
  inlineFragments: any[],
  currentValueFields: any[],
  currentValueType,
  currentValue: any,
  ast: AST,
) {
  const inlineFragmentFields: Field[] = [];

  inlineFragments
    .filter(
      (nestedFragment) =>
        nestedFragment.typeCondition.name === currentValue.__typename,
    )
    .forEach((inlineFragment) => {
      inlineFragment.fields.forEach((inlineFragmentField: Field) => {
        if (isFieldContainedInFields(inlineFragmentField, currentValueFields)) {
          return;
        }

        if (!isFieldContainedInObjectKeys(inlineFragmentField, currentValue)) {
          return;
        }

        const isGuaranteedTypeMatch = inlineFragment.possibleTypes.includes(
          makeTypeNullable(currentValueType),
        );

        inlineFragmentFields.push(
          isGuaranteedTypeMatch
            ? inlineFragmentField
            : {
                ...inlineFragmentField,
                type: makeTypeNullable(inlineFragmentField.type),
              },
        );
      });

      if (inlineFragment.fragmentSpreads.length !== 0) {
        const inlineFragmentFragmentSpreadsFields = getFragmentSpreadsFields(
          inlineFragment.fragmentSpreads,
          currentValueFields,
          currentValueType,
          currentValue,
          ast,
        );

        inlineFragmentFragmentSpreadsFields
          .filter((fragmentSpreadField) =>
            Object.keys(currentValue).includes(fragmentSpreadField.fieldName),
          )
          .map((fragmentSpreadField) =>
            inlineFragmentFields.push(fragmentSpreadField),
          );
      }
    });

  return inlineFragmentFields;
}

function getFragmentSpreadsFields(
  fragmentSpreads: any[],
  currentValueFields: any[],
  currentValueType,
  currentValue: any,
  ast: AST,
): Field[] {
  const fragmentSpreadFields: Field[] = [];

  fragmentSpreads
    .map((spread) => ast.fragments[spread])
    .forEach((fragment) => {
      fragment.fields.forEach((fragmentField) => {
        if (isFieldContainedInFields(fragmentField, currentValueFields)) {
          return;
        }

        const isGuaranteedTypeMatch = fragment.possibleTypes.includes(
          makeTypeNullable(currentValueType),
        );

        fragmentSpreadFields.push(
          isGuaranteedTypeMatch
            ? fragmentField
            : {...fragmentField, type: makeTypeNullable(fragmentField.type)},
        );
      });

      if (fragment.fragmentSpreads.length !== 0) {
        const nestedFragmentSpreads = fragment.fragmentSpreads.map(
          (spread) => ast.fragments[spread],
        );

        fragmentSpreadFields.push(
          ...getInlineFragmentsFields(
            nestedFragmentSpreads,
            currentValueFields,
            currentValueType,
            currentValue,
            ast,
          ),
        );
      }
    });

  return fragmentSpreadFields;
}

function isFieldContainedInObjectKeys(field: Field, value: any) {
  return Object.keys(value).some((key) => key === field.fieldName);
}

function isFieldContainedInFields(field: Field, fields: Field[]) {
  return fields.some(({fieldName}) => fieldName === field.fieldName);
}

function makeTypeNullable(type: GraphQLType) {
  return isNonNullType(type) ? type.ofType : type;
}

function validateListAgainstFieldDescription(
  value: any[],
  fieldDescription: Field,
  type: GraphQLList<GraphQLType>,
  keyPath: string,
  ast: AST,
): Error[] {
  const itemType = isNonNullType(type)
    ? (type as GraphQLNonNull<GraphQLList<GraphQLType>>).ofType.ofType
    : (type as GraphQLList<GraphQLType>).ofType;

  return value.reduce((allErrors, item, index) => {
    const itemKeyPath = updateKeyPath(keyPath, index);
    const itemTypeErrors = validateValueAgainstType(
      item,
      itemType,
      itemKeyPath,
      {shallow: true},
    );

    if (itemTypeErrors.length > 0) {
      return allErrors.concat(itemTypeErrors);
    }

    return Array.isArray(item)
      ? allErrors.concat(
          validateListAgainstFieldDescription(
            item,
            fieldDescription,
            itemType as GraphQLList<GraphQLType>,
            itemKeyPath,
            ast,
          ),
        )
      : allErrors.concat(
          validateValueAgainstObjectFieldDescription(
            item,
            fieldDescription,
            itemKeyPath,
            ast,
          ),
        );
  }, []);
}

function validateValueAgainstFields(
  value: {[key: string]: any},
  fields: Field[],
  keyPath: KeyPath,
  ast: AST,
) {
  const finalValue = value || {};

  const excessFields = Object.keys(finalValue)
    .filter((key) => fields.every(({responseName}) => key !== responseName))
    .map((key) => error(keyPath, `has key '${key}' not present in the query`));

  return fields.reduce((allErrors, field) => {
    return allErrors.concat(
      validateValueAgainstFieldDescription(
        finalValue[field.responseName],
        field,
        keyPath,
        ast,
      ),
    );
  }, excessFields);
}

interface TypeValidationOptions {
  shallow: boolean;
}

function validateValueAgainstType(
  value: any,
  type: GraphQLType,
  keyPath: KeyPath,
  options: TypeValidationOptions = {shallow: false},
): Error[] {
  const {shallow} = options;

  if (isNonNullType(type)) {
    return value == null
      ? [error(keyPath, `should be non-null but was ${String(value)}`)]
      : validateValueAgainstType(value, type.ofType, keyPath, options);
  }

  if (value === null) {
    return [];
  }

  const valueType = typeof value;

  if (isListType(type)) {
    if (!Array.isArray(value)) {
      return [
        error(
          keyPath,
          `should be an array (or null), but was ${articleForType(
            valueType,
          )} ${valueType}`,
        ),
      ];
    }

    return shallow
      ? []
      : value.reduce(
          (allErrors: Error[], item, index) =>
            allErrors.concat(
              validateValueAgainstType(
                item,
                type.ofType,
                updateKeyPath(keyPath, index),
                options,
              ),
            ),
          [],
        );
  }

  if (value === undefined) {
    const typeName = nameForType(type as GraphQLLeafType);
    return [
      error(
        keyPath,
        `should be ${articleForType(
          typeName,
        )} ${typeName} (or null), but was undefined`,
      ),
    ];
  }

  if (isObjectType(type)) {
    if (valueType === 'object') {
      if (shallow) {
        return [];
      } else {
        const fields = type.getFields();
        return Object.keys(value).reduce((fieldErrors: Error[], key) => {
          const fieldKeyPath = updateKeyPath(keyPath, key);

          return fields[key] == null
            ? fieldErrors.concat([
                error(
                  fieldKeyPath,
                  `does not exist on type ${
                    type.name
                  } (available fields: ${Object.keys(fields).join(', ')})`,
                ),
              ])
            : fieldErrors.concat(
                validateValueAgainstType(
                  value[key],
                  fields[key].type,
                  fieldKeyPath,
                  options,
                ),
              );
        }, []);
      }
    } else {
      return [error(keyPath, `should be an object but was a ${valueType}`)];
    }
  }

  if (type === GraphQLString) {
    return valueType === 'string'
      ? []
      : [error(keyPath, `should be a string but was a ${valueType}`)];
  } else if (type === GraphQLInt) {
    if (typeof value === 'number') {
      return Number.isInteger(value)
        ? []
        : [error(keyPath, 'should be an integer but was a float')];
    }

    return [error(keyPath, `should be an integer but was a ${valueType}`)];
  } else if (type === GraphQLFloat) {
    return Number.isNaN(value)
      ? [error(keyPath, `should be a float but was a ${valueType}`)]
      : [];
  } else if (type === GraphQLBoolean) {
    return typeof value === 'boolean'
      ? []
      : [error(keyPath, `should be a boolean but was a ${valueType}`)];
  }

  if (isScalarType(type)) {
    return type.parseValue(value) == null
      ? [error(keyPath, `value does not match scalar ${nameForType(type)}`)]
      : [];
  }

  if (isEnumType(type)) {
    try {
      return type.parseValue(value) == null
        ? [
            error(
              keyPath,
              `value does not match enum ${nameForType(
                type,
              )} (available values: ${type
                .getValues()
                .map((enumValue) => enumValue.value)
                .join(', ')})`,
            ),
          ]
        : [];
    } catch (err) {
      return [error(keyPath, err.message)];
    }
  }

  return [];
}

const CUSTOM_NAMES = {
  [GraphQLBoolean.name]: 'boolean',
  [GraphQLFloat.name]: 'float',
  [GraphQLInt.name]: 'integer',
  [GraphQLString.name]: 'string',
};

function nameForType(type: GraphQLLeafType) {
  return Object.prototype.hasOwnProperty.call(CUSTOM_NAMES, type.name)
    ? CUSTOM_NAMES[type.name]
    : type.name;
}

const TYPES_WITH_ARTICLE_AN = ['object', 'integer', 'array'];

function articleForType(type: string) {
  return TYPES_WITH_ARTICLE_AN.includes(type) ? 'an' : 'a';
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
