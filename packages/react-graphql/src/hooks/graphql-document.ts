import {useState, useEffect, useCallback} from 'react';
import {OperationVariables} from 'apollo-client';
import {DocumentNode} from 'graphql-typed';

import {AsyncQueryComponentType} from '..';

export default function useGraphQLDocument<
  Data = any,
  Variables = OperationVariables,
  DeepPartial = {}
>(
  documentOrComponent:
    | DocumentNode<Data, Variables>
    | AsyncQueryComponentType<Data, Variables, DeepPartial>,
) {
  const [document, setDocument] = useState<DocumentNode<
    Data,
    Variables
  > | null>(() => {
    if (isDocumentNode(documentOrComponent)) {
      return documentOrComponent;
    } else {
      return documentOrComponent.resolved || null;
    }
  });

  const loadDocument = useCallback(
    async () => {
      if (!isDocumentNode(documentOrComponent)) {
        try {
          const resolved = await documentOrComponent.resolve();
          setDocument(resolved);
        } catch (error) {
          throw Error('error loading GraphQL document');
        }
      }
    },
    [documentOrComponent],
  );

  useEffect(
    () => {
      if (!document) {
        loadDocument();
      }
    },
    [document, documentOrComponent, loadDocument],
  );

  return document;
}

function isDocumentNode(arg: any): arg is DocumentNode {
  return Boolean(arg && arg.kind && arg.kind === 'Document');
}
