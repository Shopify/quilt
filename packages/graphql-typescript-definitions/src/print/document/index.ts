import * as t from '@babel/types';
import {GraphQLObjectType} from 'graphql';
import {
  AST,
  Fragment,
  isTypedVariable,
  Operation,
  OperationType,
} from 'graphql-tool-utilities';

import {Options, FileContext, OperationContext} from './context';
import {ObjectStack} from './utilities';
import {tsInterfaceBodyForObjectField, variablesInterface} from './language';

const generate = require('@babel/generator').default;

export interface File {
  path: string;
  operation?: Operation;
  fragments: Fragment[];
}

export {Options};

export function printDocument(
  {path, operation, fragments}: File,
  ast: AST,
  options: Options,
) {
  const file = new FileContext(path, options);

  if (operation == null) {
    const fileBody = fragments.reduce<t.Statement[]>((statements, fragment) => {
      const context = new OperationContext(fragment, ast, options, file);
      const body = tsInterfaceBodyForObjectField(
        fragment,
        fragment.typeCondition,
        new ObjectStack(fragment.typeCondition),
        context,
      );

      const {namespace} = context;

      return [
        ...statements,
        ...(namespace ? [t.exportNamedDeclaration(namespace, [])] : []),
        t.exportNamedDeclaration(
          t.tsInterfaceDeclaration(
            t.identifier(context.typeName),
            null,
            null,
            body,
          ),
          [],
        ),
      ];
    }, []);

    const {schemaImports} = file;

    if (schemaImports) {
      fileBody.unshift(schemaImports);
    }

    return generate(t.file(t.program(fileBody), [], [])).code;
  }

  const context = new OperationContext(operation, ast, options, file);
  const partialContext = new OperationContext(
    operation,
    ast,
    {...options, partial: true},
    file,
  );

  let rootType: GraphQLObjectType;

  if (operation.operationType === OperationType.Query) {
    rootType = ast.schema.getQueryType() as any;
  } else if (operation.operationType === OperationType.Mutation) {
    rootType = ast.schema.getMutationType() as any;
  } else {
    rootType = ast.schema.getSubscriptionType() as any;
  }

  const variables =
    operation.variables.filter(isTypedVariable).length > 0
      ? context.export(variablesInterface(operation.variables, context))
      : null;

  const operationInterface = t.tsInterfaceDeclaration(
    t.identifier(context.typeName),
    null,
    null,
    tsInterfaceBodyForObjectField(
      operation,
      rootType,
      new ObjectStack(rootType),
      context,
    ),
  );

  const operationPartialInterface = t.tsInterfaceDeclaration(
    t.identifier(partialContext.typeName),
    null,
    null,
    tsInterfaceBodyForObjectField(
      operation,
      rootType,
      new ObjectStack(rootType),
      partialContext,
    ),
  );

  const {schemaImports} = file;
  const {namespace} = context;
  const {namespace: partialNamespace} = partialContext;

  const documentNodeImport = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier('DocumentNode'),
        t.identifier('DocumentNode'),
      ),
    ],
    t.stringLiteral('graphql-typed'),
  );

  const documentNodeDeclaratorIdentifier = t.identifier('document');
  documentNodeDeclaratorIdentifier.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('DocumentNode'),
      t.tsTypeParameterInstantiation([
        t.tsTypeReference(t.identifier(context.typeName)),
        variables || t.tsNeverKeyword(),
        t.tsTypeReference(t.identifier(partialContext.typeName)),
      ]),
    ),
  );

  const documentNodeDeclaration = t.variableDeclaration('const', [
    t.variableDeclarator(documentNodeDeclaratorIdentifier),
  ]);

  documentNodeDeclaration.declare = true;

  const documentNodeExport = t.exportDefaultDeclaration(
    t.identifier('document'),
  );

  const fileBody: t.Statement[] = [documentNodeImport];

  if (schemaImports) {
    fileBody.push(schemaImports);
  }

  if (partialNamespace) {
    fileBody.push(t.exportNamedDeclaration(partialNamespace, []));
  }

  fileBody.push(t.exportNamedDeclaration(operationPartialInterface, []));

  if (namespace) {
    fileBody.push(t.exportNamedDeclaration(namespace, []));
  }

  fileBody.push(
    t.exportNamedDeclaration(operationInterface, []),
    documentNodeDeclaration,
    documentNodeExport,
  );

  return generate(t.file(t.program(fileBody), [], [])).code;
}
