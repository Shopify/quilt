import {resolve} from 'path';
import {runInNewContext} from 'vm';

import type {
  PluginObj,
  BabelFile,
  NodePath,
  types as babelTypes,
  template as babelTemplate,
} from '@babel/core';

import type {Options as LoaderOptions} from './webpack-parts/loader';

type Binding = BabelFile['scope']['bindings'][string];

export const DEFAULT_PACKAGES_TO_PROCESS = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '@shopify/web-worker': [
    {name: 'createPlainWorkerFactory'},
    {
      name: 'createWorkerFactory',
      wrapperModule: resolve(__dirname, 'wrappers/expose.js.raw'),
    },
  ] as ProcessableImport[],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '@shopify/react-web-worker': [
    {name: 'createPlainWorkerFactory'},
    {
      name: 'createWorkerFactory',
      wrapperModule: resolve(__dirname, 'wrappers/expose.js.raw'),
    },
  ] as ProcessableImport[],
};

const loader = resolve(__dirname, 'webpack-parts/loader');

export interface ProcessableImport {
  name: string;
  wrapperModule?: string;
}

export interface Options {
  noop?: boolean;
  packages?: {[key: string]: (string | ProcessableImport)[]};
}

interface State {
  process: Map<string, ProcessableImport[]>;
  program: NodePath<babelTypes.Program>;
  opts?: Options;
}

export default function workerBabelPlugin({
  types: t,
  template,
}: {
  types: typeof babelTypes;
  template: typeof babelTemplate;
}): PluginObj<State> {
  const noopBinding = template(
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
  ) as unknown as () => babelTypes.ArrowFunctionExpression;

  return {
    visitor: {
      Program(program, state) {
        state.program = program;

        const packages = state.opts?.packages
          ? normalize(state.opts.packages)
          : DEFAULT_PACKAGES_TO_PROCESS;

        state.process = new Map(Object.entries(packages));
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
            specifier.node.imported.type !== 'Identifier'
          ) {
            continue;
          }

          const importedName = specifier.node.imported.name;
          const processableImport = processImports.find(
            ({name}) => name === importedName,
          );

          if (processableImport == null) {
            continue;
          }

          const binding = specifier.scope.getBinding(
            specifier.node.imported.name,
          );

          if (binding == null) {
            continue;
          }

          processBinding(binding, processableImport, state);
        }
      },
    },
  };

  function processBinding(
    binding: Binding,
    importOptions: ProcessableImport,
    state: State,
  ) {
    const {program, opts: options = {}} = state;
    const {noop = false} = options;

    const callingReferences = binding.referencePaths.filter((referencePath) =>
      referencePath.parentPath.isCallExpression(),
    );

    type CallExpressionNodePath = NodePath<babelTypes.CallExpression>;

    for (const referencePath of callingReferences) {
      const callExpression: CallExpressionNodePath =
        referencePath.parentPath as any;
      const dynamicImports = new Set<CallExpressionNodePath>();

      const firstArgument = callExpression.get('arguments')[0];

      firstArgument.traverse({
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
        firstArgument.replaceWith(noopBinding());
        return;
      }

      const {leadingComments} = dynamicallyImported.node;
      const options = {
        ...getLoaderOptions(leadingComments || []),
        wrapperModule: importOptions.wrapperModule,
      };

      const importId = callExpression.scope.generateUidIdentifier('worker');

      program
        .get('body')[0]
        .insertBefore(
          t.importDeclaration(
            [t.importDefaultSpecifier(importId)],
            t.stringLiteral(`${loader}?${JSON.stringify(options)}!${imported}`),
          ),
        );

      firstArgument.replaceWith(importId);
    }
  }
}

// Reduced replication of webpack’s logic for parsing import comments:
// https://github.com/webpack/webpack/blob/5147aed90ec8cd3633b0c45583f02afd16c7888d/lib/JavascriptParser.js#L2799-L2820
const webpackCommentRegExp = new RegExp(/(^|\W)webpack[A-Z]{1,}[A-Za-z]{1,}:/);

function getLoaderOptions(
  comments: ReadonlyArray<babelTypes.Comment>,
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

function normalize(packages: NonNullable<Options['packages']>) {
  return Object.keys(packages).reduce<{[key: string]: ProcessableImport[]}>(
    (all, pkg) => ({
      ...all,
      [pkg]: packages[pkg].map((anImport) =>
        typeof anImport === 'string' ? {name: anImport} : anImport,
      ),
    }),
    {},
  );
}
