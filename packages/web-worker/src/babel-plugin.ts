import {resolve} from 'path';

const loader = resolve(__dirname, 'webpack-parts/loader');

interface State {
  program: import('@babel/traverse').NodePath<import('@babel/types').Program>;
}

export default function workerBabelPlugin({
  types: t,
}: {
  types: typeof import('@babel/types');
}): import('@babel/core').PluginObj<State> {
  return {
    visitor: {
      Program(program, state) {
        state.program = program;
      },
      CallExpression(nodePath) {
        const callee = nodePath.get('callee');
        if (!callee.isIdentifier()) {
          return;
        }

        if (callee.node.name !== 'createWorker') {
          return;
        }

        const dynamicImports = new Set();

        nodePath.traverse({
          Import({parentPath}) {
            if (parentPath.isCallExpression()) {
              dynamicImports.add(parentPath);
            }
          },
        });

        if (dynamicImports.size === 0) {
          return;
        }

        const {value: imported} = [...dynamicImports][0]
          .get('arguments')[0]
          .evaluate();

        nodePath.replaceWith(
          t.callExpression(callee.node, [
            t.memberExpression(
              t.callExpression(t.identifier('require'), [
                t.stringLiteral(`${loader}!${imported}`),
              ]),
              t.identifier('default'),
            ),
          ]),
        );
      },
    },
  };
}
