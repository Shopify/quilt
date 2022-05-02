import {SchemaNode} from '../types';

/**
 * Ask yourself if you really should check for this
 * this is a utility for the consumer code to understand
 * which repository is being used to render forms.
 * As there was many clone versions,
 * all with similar structures some utilities were polymorphic
 * dealing with the slight API discrepancies using that function
 */
export function isSchemaNode<T = unknown>(node: any): node is SchemaNode<T> {
  return Boolean(node?.constructor === SchemaNode);
}
