import * as traverse from '@babel/traverse';
import * as t from '@babel/types';
import {astFrom} from '../utilities';

export default function addInterface(newInterface: string) {
  const ast = astFrom(`${newInterface}`);

  if (!t.isTSInterfaceDeclaration(ast)) {
    throw new Error();
  }

  let added = false;

  return {
    TSInterfaceDeclaration(path: traverse.NodePath<t.TSInterfaceDeclaration>) {
      if (path.node.id.name === ast.id.name) {
        path.node.body.body = path.node.body.body.concat(ast.body.body);
        added = true;
      }
    },
    Program: {
      exit(path: traverse.NodePath<t.Program>) {
        if (!added) {
          path.node.body.unshift(ast);
        }
      },
    },
  };
}
