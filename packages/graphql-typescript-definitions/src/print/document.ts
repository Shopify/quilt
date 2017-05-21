import {pascal} from 'change-case';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLType,
  isCompositeType,
  GraphQLCompositeType,
} from 'graphql';
import {Field} from 'graphql-tool-utilities/ast';

type KeyPath = string[];

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

  constructor(public field: Field, private keyPath: KeyPath, private document: Document) {}
}

export default class Document {
  fieldObjects: FieldObject[] = [];
  private typesUsed = new Map<GraphQLCompositeType, number>();
  private fieldMap = new Map<Field, FieldObject>();

  constructor(public name: string, {fields}: {fields: Field[]}) {
    for (const field of fields) {
      this.collect(field);
    }
  }

  hasMultipleOfType(type: GraphQLCompositeType) {
    return (this.typesUsed.get(type) || 0) > 1;
  }

  fieldObjectForField(field: Field) {
    return this.fieldMap.get(field) as FieldObject;
  }

  private collect(field: Field, parentKeyPath: KeyPath = []) {
    if (field.fields == null) { return; }
    const newKeyPath = [...parentKeyPath, field.responseName];
    const fieldObject = new FieldObject(field, newKeyPath, this);
    const usedSoFar = this.typesUsed.get(fieldObject.compositeType) || 0;
    this.typesUsed.set(fieldObject.compositeType, usedSoFar + 1);
    this.fieldObjects.unshift(fieldObject);
    this.fieldMap.set(field, fieldObject);

    for (const subfield of field.fields) {
      this.collect(subfield, newKeyPath);
    }

    for (const inlineFragment of (field.inlineFragments || [])) {
      for (const subfield of inlineFragment.fields) {
        this.collect(subfield, newKeyPath);
      }
    }
  }
}

function getNestedCompositeType(type: GraphQLType): GraphQLCompositeType {
  let finalType = type;
  while (finalType instanceof GraphQLNonNull || finalType instanceof GraphQLList) {
    finalType = finalType.ofType;
  }

  if (!isCompositeType(finalType)) { throw new Error(`Expected a composite type, but received ${finalType.toString()}`); }
  return finalType;
}
