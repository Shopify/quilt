import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

export default function replaceStrings(replacements: Array<[string, string]>) {
  return {
    StringLiteral(path: traverse.NodePath<t.StringLiteral>) {
      replacements.forEach(replacement => {
        if (path.node.value === replacement[0]) {
          path.replaceWith(t.stringLiteral(replacement[1]));
        }
      });
    },
  };
}
