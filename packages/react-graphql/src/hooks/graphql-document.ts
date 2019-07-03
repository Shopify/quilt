import {useState, useEffect, useCallback} from 'react';
import {OperationVariables} from 'apollo-client';
import {DocumentNode} from 'graphql-typed';
import {useMountedRef} from '@shopify/react-hooks';
import {useAsyncAsset} from '@shopify/react-async';

import {AsyncQueryComponentType} from '../types';

export default function useGraphQLDocument<
  Data = any,
  Variables = OperationVariables,
  DeepPartial = {}
>(
  documentOrComponent:
    | DocumentNode<Data, Variables>
    | AsyncQueryComponentType<Data, Variables, DeepPartial>,
): DocumentNode<Data, Variables> | null {
  const [document, setDocument] = useState<DocumentNode<
    Data,
    Variables
  > | null>(() => {
    if (isDocumentNode(documentOrComponent)) {
      return documentOrComponent;
    } else {
      return documentOrComponent.resolver.resolved;
    }
  });

  const mounted = useMountedRef();

  const loadDocument = useCallback(
    async () => {
      if (!isDocumentNode(documentOrComponent)) {
        try {
          const resolved = await documentOrComponent.resolver.resolve();
          if (mounted.current) {
            setDocument(resolved);
          }
        } catch (error) {
          throw Error('error loading GraphQL document');
        }
      }
    },
    [documentOrComponent, mounted],
  );

  useEffect(
    () => {
      if (!document) {
        loadDocument();
      }
    },
    [document, loadDocument],
  );

  useAsyncAsset(
    isDocumentNode(documentOrComponent)
      ? undefined
      : documentOrComponent.resolver.id,
  );

  return document;
}

function isDocumentNode(arg: any): arg is DocumentNode {
  return Boolean(arg && arg.kind && arg.kind === 'Document');
}
