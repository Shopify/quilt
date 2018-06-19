export default function babelPluginAsyncChunks(babel) {
  const {types: t} = babel;
  return {
    visitor: {
      ImportDeclaration(path: any) {
        // Bail if source is not @shopify/async-chunks
        const source = path.node.source.value;
        if (source !== '@shopify/async-chunks') {
          return;
        }

        // We only want to tranpsile default imports, which is the HOC
        const defaultSpecifier = defaultImport(path);
        if (!defaultSpecifier) {
          return;
        }

        const bindingName = defaultSpecifier.node.local.name;
        const binding = path.scope.getBinding(bindingName);

        binding.referencePaths.forEach(refPath => {
          let callExpression = refPath.parentPath;

          if (
            callExpression.isMemberExpression() &&
            callExpression.node.computed === false &&
            callExpression.get('property').isIdentifier({name: 'Map'})
          ) {
            callExpression = callExpression.parentPath;
          }

          if (!callExpression.isCallExpression()) {
            return;
          }

          const args = callExpression.get('arguments');
          if (args.length !== 1) {
            throw callExpression.error;
          }

          const options = args[0];
          if (!options.isObjectExpression()) {
            return;
          }

          const properties = options.get('properties');
          const propertiesMap: any = {};

          properties.forEach(property => {
            const key = property.get('key');
            propertiesMap[key.node.name] = property;
          });

          if (propertiesMap.webpack) {
            return;
          }

          const loaderMethod = propertiesMap.loader.get('value');
          const dynamicImports: any = [];

          loaderMethod.traverse({
            Import(path) {
              dynamicImports.push(path.parentPath);
            },
          });

          if (!dynamicImports.length) {
            return;
          }

          insertMetadata(t, propertiesMap, dynamicImports);
        });
      },
    },
  };
}

function defaultImport(path) {
  return path.get('specifiers').find(specifier => {
    return specifier.isImportDefaultSpecifier();
  });
}

function insertMetadata(t, propertiesMap, dynamicImports) {
  insertWebpackMetadata(t, propertiesMap, dynamicImports);
  insertModulesMetadata(t, propertiesMap, dynamicImports);
}

function insertModulesMetadata(t, propertiesMap, dynamicImports) {
  propertiesMap.loader.insertAfter(
    t.objectProperty(
      t.identifier('modules'),
      t.arrayExpression(
        dynamicImports.map(dynamicImport => {
          return dynamicImport.get('arguments')[0].node;
        }),
      ),
    ),
  );
}

function insertWebpackMetadata(t, propertiesMap, dynamicImports) {
  propertiesMap.loader.insertAfter(
    t.objectProperty(
      t.identifier('webpack'),
      t.arrowFunctionExpression(
        [],
        t.arrayExpression(
          dynamicImports.map(dynamicImport => {
            return t.callExpression(
              t.memberExpression(
                t.identifier('require'),
                t.identifier('resolveWeak'),
              ),
              [dynamicImport.get('arguments')[0].node],
            );
          }),
        ),
      ),
    ),
  );
}
