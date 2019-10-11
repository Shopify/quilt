import {resolve} from 'path';

const DEFAULT_PACKAGES_TO_PROCESS = {
  '@shopify/web-worker': ['createWorker'],
};

const loader = resolve(__dirname, 'webpack-parts/loader');

export interface Options {
  noop?: boolean;
  packages?: {[key: string]: string[]};
}

interface State {
  process: Map<string, string[]>;
  program: import('@babel/traverse').NodePath<import('@babel/types').Program>;
  opts?: Options;
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
        state.process = new Map(
          Object.entries(
            (state.opts && state.opts.packages) || DEFAULT_PACKAGES_TO_PROCESS,
          ),
        );
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
