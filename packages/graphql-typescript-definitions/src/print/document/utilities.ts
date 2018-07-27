import {ucFirst} from 'change-case';
import {
  GraphQLCompositeType,
  // We need to bring these in as they are implicitly referenced by
  // GraphQLCompositeType, but TypeScript doesn’t know this when it
  // generates its declaration files.
  // @ts-ignore
  GraphQLInterfaceType,
  // @ts-ignore
  GraphQLObjectType,
  // @ts-ignore
  GraphQLUnionType,
} from 'graphql';
import {Field} from 'graphql-tool-utilities/ast';

export class ObjectStack {
  private seenFields = new Set<string>();

  get name(): string {
    const {parent, field, isFragment, type} = this;
    const fieldName = field ? ucFirst(field.responseName) : '';
    const name = `${parent ? parent.name : ''}${fieldName}`;
    return isFragment ? `${name}${type ? type.name : 'Other'}` : name;
  }

  constructor(
    private type?: GraphQLCompositeType,
    private field?: Field,
    private parent?: ObjectStack,
    private isFragment = false,
  ) {}

  nested(field: Field, type: GraphQLCompositeType) {
    return new ObjectStack(type, field, this);
  }

  fragment(type?: GraphQLCompositeType) {
    return new ObjectStack(type, this.field, this.parent, true);
  }

  sawField(field: Field) {
    this.seenFields.add(field.responseName);
  }

  hasSeenField(field: Field) {
    return this.seenFields.has(field.responseName);
  }
}
