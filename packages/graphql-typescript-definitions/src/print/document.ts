import {pascal} from 'change-case';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLType,
  isCompositeType,
  GraphQLCompositeType,
} from 'graphql';
import {Field, InlineFragment} from 'graphql-tool-utilities/ast';

export type KeyPath = string[];

export class FieldObject {
  get name() {
    const {document, keyPath, compositeType} = this;

    return document.hasMultipleOfType(compositeType)
      ? `${pascal(keyPath.join(' '))}${compositeType.name}`
      : compositeType.name;
  }

  get compositeType() {
    return getNestedCompositeType(this.field.type);
  }

  constructor(
    public field: Field,
    private keyPath: KeyPath,
    private document: Document,
  ) {}
}

export default class Document {
  fieldObjects: FieldObject[] = [];
  private typesUsed = new Map<GraphQLCompositeType, number>();
  private fieldMap = new Map<Field, FieldObject>();

  constructor(
    public name: string,
    {
      fields,
      inlineFragments = [],
    }: {fields: Field[]; inlineFragments?: InlineFragment[]},
  ) {
    for (const field of fields) {
      this.collectField(field);
    }

    for (const inlineFragment of inlineFragments) {
      this.collectFragment(inlineFragment);
    }
  }

  hasMultipleOfType(type: GraphQLCompositeType) {
    return (this.typesUsed.get(type) || 0) > 1;
  }

  fieldObjectForField(field: Field) {
    return this.fieldMap.get(field) as FieldObject;
  }

  private collectFragment(fragment: InlineFragment, keyPath: KeyPath = []) {
    const {inlineFragments = [], fields} = fragment;

    for (const field of fields) {
      this.collectField(field, keyPath);
    }

    for (const inlineFragment of inlineFragments) {
      this.collectFragment(inlineFragment, keyPath);
    }
  }

  private collectField(field: Field, parentKeyPath: KeyPath = []) {
    if (field.fields == null) {
      return;
    }
    const newKeyPath = [...parentKeyPath, field.responseName];
    const fieldObject = new FieldObject(field, newKeyPath, this);
    const usedSoFar = this.typesUsed.get(fieldObject.compositeType) || 0;
    this.typesUsed.set(fieldObject.compositeType, usedSoFar + 1);
    this.fieldObjects.unshift(fieldObject);
    this.fieldMap.set(field, fieldObject);

    for (const subfield of field.fields) {
      this.collectField(subfield, newKeyPath);
    }

    for (const inlineFragment of field.inlineFragments || []) {
      this.collectFragment(inlineFragment, newKeyPath);
    }
  }
}

function getNestedCompositeType(type: GraphQLType): GraphQLCompositeType {
  let finalType = type;
  while (
    finalType instanceof GraphQLNonNull ||
    finalType instanceof GraphQLList
  ) {
    finalType = finalType.ofType;
  }

  if (!isCompositeType(finalType)) {
    throw new Error(
      `Expected a composite type, but received ${finalType.toString()}`,
    );
  }
  return finalType;
}
