import * as t from '@babel/types';
import {GraphQLObjectType} from 'graphql';
import {
  AST,
  Fragment,
  isTypedVariable,
  Operation,
  OperationType,
} from 'graphql-tool-utilities';

import {ExportFormat} from '../../types';

import {Options, FileContext, OperationContext} from './context';
import {ObjectStack} from './utilities';
import {tsInterfaceBodyForObjectField, variablesInterface} from './language';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const generate = require('@babel/generator').default;

export interface File {
  path: string;
  operation?: Operation;
  fragments: Fragment[];
}

export type {Options};

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
  const {exportFormat = ExportFormat.Document} = options;
  const documentType = [
    ExportFormat.Document,
    ExportFormat.DocumentWithTypedDocumentNode,
  ].includes(exportFormat)
    ? 'DocumentNode'
    : 'SimpleDocument';

  const includeTypedDocumentNode =
    exportFormat === ExportFormat.DocumentWithTypedDocumentNode;

  const documentNodeImport = () => {
    const identifier = t.identifier(documentType);
    return t.importDeclaration(
      [t.importSpecifier(identifier, identifier)],
      t.stringLiteral('graphql-typed'),
    );
  };

  const typedDocumentNodeImport = () => {
    const identifier = t.identifier('TypedDocumentNode');
    return t.importDeclaration(
      [t.importSpecifier(identifier, identifier)],
      t.stringLiteral('@graphql-typed-document-node/core'),
    );
  };

  const emptyObjectTypeLiteral = () =>
    t.tsTypeLiteral([
      t.tsIndexSignature(
        [
          {
            ...t.identifier('key'),
            typeAnnotation: t.tsTypeAnnotation(t.tsStringKeyword()),
          },
        ],
        t.tsTypeAnnotation(t.tsNeverKeyword()),
      ),
    ]);

  const graphqlTypedTypeReference = () =>
    t.tsTypeReference(
      t.identifier(documentType),
      t.tsTypeParameterInstantiation([
        t.tsTypeReference(t.identifier(context.typeName)),
        variables || t.tsNeverKeyword(),
        t.tsTypeReference(t.identifier(partialContext.typeName)),
      ]),
    );

  // `@graphql-codegen`'s typed-document-node plugin states that when no
  // variables are present they should be typed as an "empty object" -
  // `TypedDocumentNode<Result, {[key: string]: never;}>`
  // This differs from the behaviour of graphql-typed which uses never for
  // absent variables - `DocumentNode<Result, never, PartialData>`.
  // "empty object" is slightly more lax - it allows doing
  // `useQuery(myQuery, {variables: {}})`. I think this is more intuitive as it
  // says "Variables are always an object, it might not have any keys though"
  // See www.graphql-code-generator.com/plugins/typed-document-node
  const graphqlTypedDocumentNodeReference = () =>
    t.tsTypeReference(
      t.identifier('TypedDocumentNode'),
      t.tsTypeParameterInstantiation([
        t.tsTypeReference(t.identifier(context.typeName)),
        variables || emptyObjectTypeLiteral(),
      ]),
    );

  const documentNodeDeclaratorIdentifier = {
    ...t.identifier('document'),
    typeAnnotation: t.tsTypeAnnotation(
      includeTypedDocumentNode
        ? t.tsIntersectionType([
            graphqlTypedTypeReference(),
            graphqlTypedDocumentNodeReference(),
          ])
        : graphqlTypedTypeReference(),
    ),
  };

  const documentNodeDeclaration = t.variableDeclaration('const', [
    t.variableDeclarator(documentNodeDeclaratorIdentifier),
  ]);

  documentNodeDeclaration.declare = true;

  const documentNodeExport = t.exportDefaultDeclaration(
    t.identifier('document'),
  );

  const fileBody: t.Statement[] = [documentNodeImport()];

  if (includeTypedDocumentNode) {
    fileBody.push(typedDocumentNodeImport());
  }

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
