import {
  GraphQLCompositeType,
  // We need to bring these in as they are implicitly referenced by
  // GraphQLCompositeType, but TypeScript doesn’t know this when it
  // generates its declaration files.
  // @ts-expect-error TS needs this implict reference though we never use it explicitly
  GraphQLInterfaceType,
  // @ts-expect-error TS needs this implict reference though we never use it explicitly
  GraphQLObjectType,
  // @ts-expect-error TS needs this implict reference though we never use it explicitly
  GraphQLUnionType,
} from 'graphql';
import {Field} from 'graphql-tool-utilities';

export class ObjectStack {
  private readonly seenFields = new Set<string>();

  get name(): string {
    const {parent, field, isFragment, type} = this;
    const fieldName = field ? upperCaseFirst(field.responseName) : '';
    const name = `${parent ? parent.name : ''}${fieldName}`;
    return isFragment ? `${name}${type ? type.name : 'Other'}` : name;
  }

  constructor(
    private readonly type?: GraphQLCompositeType,
    private readonly field?: Field,
    private readonly parent?: ObjectStack,
    private readonly isFragment = false,
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

export function upperCaseFirst(input: string) {
  return input.charAt(0).toUpperCase() + input.substr(1);
}
