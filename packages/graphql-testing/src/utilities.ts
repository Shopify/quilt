import {DocumentNode, OperationDefinitionNode} from 'graphql';
import {FindOptions} from './types';

export function operationNameFromFindOptions({
  query,
  mutation,
  operationName,
}: FindOptions) {
  const passedOptions = [query, mutation, operationName].filter(Boolean);

  if (passedOptions.length === 0) {
    return undefined;
  } else if (passedOptions.length > 1) {
    throw new Error(
      'You can only pass one of query, mutation, or operationName when finding a GraphQL operation',
    );
  }

  return operationName || operationNameFromDocument((query || mutation)!);
}

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
