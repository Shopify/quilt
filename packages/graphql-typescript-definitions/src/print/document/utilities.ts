import {ucFirst} from 'change-case';
import {GraphQLCompositeType} from 'graphql';
import {Field} from 'graphql-tool-utilities/ast';

export class ObjectStack {
  private seenFields = new Set<string>();

  get name() {
    return this.parentFields
      .map(({responseName}) => ucFirst(responseName))
      .join('');
  }

  constructor(
    _type: GraphQLCompositeType,
    private parentFields: Field[] = [],
  ) {}

  nested(field: Field, type: GraphQLCompositeType) {
    return new ObjectStack(type, [...this.parentFields, field]);
  }

  fragment(type: GraphQLCompositeType) {
    return new ObjectStack(type, this.parentFields);
  }

  sawField(field: Field) {
    this.seenFields.add(field.responseName);
  }

  hasSeenField(field: Field) {
    return this.seenFields.has(field.responseName);
  }
}
