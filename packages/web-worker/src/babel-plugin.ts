import {resolve} from 'path';
import {runInNewContext} from 'vm';

const DEFAULT_PACKAGES_TO_PROCESS = {
  '@shopify/web-worker': ['createWorkerFactory'],
  '@shopify/react-web-worker': ['createWorkerFactory'],
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
  template,
}: {
  types: typeof import('@babel/types');
  template: typeof import('@babel/template').default;
}): import('@babel/core').PluginObj<State> {
  const noopBinding = (template(
    `() => (
      new Proxy(
        {},
        {
          get() {
            return () => {
              throw new Error('You can’t call a method on a noop worker');
            };
          },
        },
      )
    );`,
    {sourceType: 'module'},
  ) as unknown) as () => import('@babel/types').ArrowFunctionExpression;

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
      ImportDeclaration(importDeclaration, state) {
        const processImports = state.process.get(
          importDeclaration.node.source.value,
        );

        if (processImports == null) {
          return;
        }

        for (const specifier of importDeclaration.get('specifiers')) {
          if (
            !specifier.isImportSpecifier() ||
            !processImports.includes(specifier.get('imported').node.name)
          ) {
            continue;
          }

          const binding = specifier.scope.getBinding(
            specifier.get('imported').node.name,
          );

          if (binding == null) {
            continue;
          }

          processBinding(binding, state);
        }
      },
    },
  };

  function processBinding(
    binding: import('@babel/traverse').Binding,
    state: State,
  ) {
    const {program, opts: options = {}} = state;
    const {noop = false} = options;

    const callingReferences = binding.referencePaths.filter(referencePath =>
      referencePath.parentPath.isCallExpression(),
    );

    type CallExpressionNodePath = import('@babel/traverse').NodePath<
      import('@babel/types').CallExpression
    >;

    for (const referencePath of callingReferences) {
      const callExpression: CallExpressionNodePath = referencePath.parentPath as any;
      const dynamicImports = new Set<CallExpressionNodePath>();

      callExpression.traverse({
        Import({parentPath}) {
          if (parentPath.isCallExpression()) {
            dynamicImports.add(parentPath);
          }
        },
      });

      if (dynamicImports.size === 0) {
        return;
      }

      if (dynamicImports.size > 1) {
        throw new Error(
          'You made more than one dynamic import in the body of a web worker create function. Only one such import is allowed.',
        );
      }

      const dynamicallyImported = [...dynamicImports][0].get('arguments')[0];
      const {value: imported, confident} = dynamicallyImported.evaluate();

      if (typeof imported !== 'string' || !confident) {
        throw new Error(
          `Failed to evaluate a dynamic import to a string to create a web worker (${dynamicallyImported.getSource()})`,
        );
      }

      if (noop) {
        callExpression.replaceWith(noopBinding());
        return;
      }

      const {leadingComments} = dynamicallyImported.node;
      const options = getLoaderOptions(leadingComments || []);

      const importId = callExpression.scope.generateUidIdentifier('worker');

      program
        .get('body')[0]
        .insertBefore(
          t.importDeclaration(
            [t.importDefaultSpecifier(importId)],
            t.stringLiteral(`${loader}?${JSON.stringify(options)}!${imported}`),
          ),
        );

      callExpression.replaceWith(
        t.callExpression(callExpression.get('callee').node, [importId]),
      );
    }
  }
}

type LoaderOptions = import('./webpack-parts/loader').Options;

// Reduced replication of webpack’s logic for parsing import comments:
// https://github.com/webpack/webpack/blob/5147aed90ec8cd3633b0c45583f02afd16c7888d/lib/JavascriptParser.js#L2799-L2820
const webpackCommentRegExp = new RegExp(/(^|\W)webpack[A-Z]{1,}[A-Za-z]{1,}:/);

function getLoaderOptions(
  comments: ReadonlyArray<import('@babel/types').Comment>,
): LoaderOptions {
  return comments.reduce<LoaderOptions>((options, comment) => {
    const {value} = comment;

    if (!value || !webpackCommentRegExp.test(value)) {
      return options;
    }

    try {
      const {webpackChunkName: name} = runInNewContext(
        `(function(){return {${value}};})()`,
      );

      return name ? {...options, name} : options;
    } catch {
      return options;
    }
  }, {});
}
