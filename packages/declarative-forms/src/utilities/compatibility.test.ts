import {DeclarativeFormContext} from '../DeclarativeFormContext';
import {SchemaNode} from '../types';

import {isSchemaNode} from './compatibility';

describe('isNodeDefined', () => {
  it('returns true when the instance is from SchemaNode', () => {
    const context = new DeclarativeFormContext({});
    const node = new SchemaNode(context, {});
    expect(isSchemaNode(node)).toBe(true);
  });

  it('returns false when the instance is not from SchemaNode even if alike', () => {
    const context = new DeclarativeFormContext({});
    const node = new SchemaNode(context, {});
    const fakeNode = {...node};
    expect(isSchemaNode(fakeNode)).toBe(false);
  });
});
