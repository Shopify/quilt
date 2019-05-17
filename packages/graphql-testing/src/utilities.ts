import {DocumentNode, OperationDefinitionNode} from 'graphql';

export function operationNameFromDocument(
  document: DocumentNode | {resolved?: DocumentNode},
) {
  return 'resolved' in document && document.resolved != null
    ? operationNameFromDocumentNode(document.resolved!)
    : operationNameFromDocumentNode(document as DocumentNode);
}

export function operationTypeFromDocument(
  document: DocumentNode | {resolved?: DocumentNode},
) {
  return 'resolved' in document && document.resolved != null
    ? operationTypeFromDocumentNode(document.resolved!)
    : operationTypeFromDocumentNode(document as DocumentNode);
}

function operationNameFromDocumentNode(document: DocumentNode) {
  const [operation]: OperationDefinitionNode[] = document.definitions.filter(
    ({kind}) => kind === 'OperationDefinition',
  ) as any[];

  return operation && operation.name && operation.name.value;
}

function operationTypeFromDocumentNode(document: DocumentNode) {
  const [operation]: OperationDefinitionNode[] = document.definitions.filter(
    ({kind}) => kind === 'OperationDefinition',
  ) as any[];

  return operation && operation.operation;
}
