import * as Types from '@babel/types';
import {NodePath, Binding} from '@babel/traverse';

const DEFAULT_PACKAGES_TO_PROCESS = {
  '@shopify/react-async': ['createAsyncComponent', 'createAsyncContext'],
  '@shopify/react-graphql': ['createAsyncQueryComponent'],
};

export interface Options {
  packages?: {[key: string]: string[]};
}

interface State {
  processPackages?: Map<string, string[]>;
  opts?: Options;
}

export default function asyncBabelPlugin({types: t}: {types: typeof Types}) {
  return {
    visitor: {
      Program(_path: NodePath<Types.Program>, state: State) {
        state.processPackages = new Map(
          Object.entries(
            (state.opts && state.opts.packages) || DEFAULT_PACKAGES_TO_PROCESS,
          ),
        );
      },
      ImportDeclaration(path: NodePath<Types.ImportDeclaration>, state: State) {
        const {processPackages} = state;

        if (!(processPackages instanceof Map)) {
          return;
        }

        const source = path.node.source.value;

        const processImports = processPackages.get(source) || [];

        if (processImports.length === 0) {
          return;
        }

        const importSpecifiersToProcess = path
          .get('specifiers')
          .filter(specifier => {
            return (
              specifier.isImportSpecifier() &&
              processImports.some(name =>
                specifier.get('imported').isIdentifier({name}),
              )
            );
          });

        if (importSpecifiersToProcess.length === 0) {
          return;
        }

        for (const importSpecifier of importSpecifiersToProcess) {
          const bindingName = importSpecifier.node.local.name;
          const binding = path.scope.getBinding(bindingName);
          if (binding != null) {
            addIdOption(binding, t);
          }
        }
      },
    },
  };
}

function addIdOption(binding: Binding, t: typeof Types) {
  binding.referencePaths.forEach(refPath => {
    const callExpression = refPath.parentPath;

    if (!callExpression.isCallExpression()) {
      return;
    }

    const args = callExpression.get('arguments');
    if (args.length === 0) {
      return;
    }

    const options = args[0];
    if (!options.isObjectExpression()) {
      return;
    }

    const properties = options.get('properties');
    const propertiesMap: {
      [key: string]: NodePath<Types.ObjectMember>;
    } = {};

    properties.forEach(property => {
      if (!property.isObjectMember() || property.node.computed) {
        return;
      }

      const key = property.get('key') as NodePath;

      if (!key.isIdentifier()) {
        return;
      }

      propertiesMap[key.node.name] = property;
    });

    const {id, load: loadProperty} = propertiesMap;

    if (id != null || loadProperty == null) {
      return;
    }

    const loaderMethod = loadProperty.isObjectProperty()
      ? loadProperty.get('value')
      : loadProperty.get('body');

    const dynamicImports: NodePath<Types.CallExpression>[] = [];

    if (!Array.isArray(loaderMethod)) {
      loaderMethod.traverse({
        Import({parentPath}) {
          if (parentPath.isCallExpression()) {
            dynamicImports.push(parentPath);
          }
        },
      });
    }

    if (!dynamicImports.length) {
      return;
    }

    propertiesMap.load.insertAfter(
      t.objectProperty(
        t.identifier('id'),
        t.arrowFunctionExpression(
          [],
          t.callExpression(
            t.memberExpression(
              t.identifier('require'),
              t.identifier('resolveWeak'),
            ),
            [dynamicImports[0].get('arguments')[0].node],
          ),
        ),
      ),
    );
  });
}
