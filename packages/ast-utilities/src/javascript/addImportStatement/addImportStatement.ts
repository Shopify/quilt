import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

import {astFrom} from '../utilities';

export default function addImportStatement(statement: string | string[]) {
  const statements = Array.isArray(statement) ? statement : [statement];

  return {
    Program(path: traverse.NodePath<t.Program>) {
      statements.forEach((statement) => {
        const ast = astFrom(`${statement}
        `);

        if (!t.isImportDeclaration(ast)) {
          return;
        }

        path.node.body.unshift(ast);
      });
    },
  };
}
