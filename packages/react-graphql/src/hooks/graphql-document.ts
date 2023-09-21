import {useState, useEffect, useCallback} from 'react';
import type {OperationVariables} from '@apollo/client/core';
import type {DocumentNode} from 'graphql-typed';
import {useMountedRef} from '@shopify/react-hooks';
import {useAsyncAsset} from '@shopify/react-async';

import type {AsyncDocumentNode} from '../types';

export default function useGraphQLDocument<
  Data extends {} = any,
  Variables extends OperationVariables = OperationVariables,
  DeepPartial extends {} = {},
>(
  documentOrAsyncDocument:
    | DocumentNode<Data, Variables>
    | AsyncDocumentNode<Data, Variables, DeepPartial>,
): DocumentNode<Data, Variables> | null {
  const [document, setDocument] = useState<DocumentNode<
    Data,
    Variables
  > | null>(() => {
    if (isDocumentNode(documentOrAsyncDocument)) {
      return documentOrAsyncDocument;
    } else {
      return documentOrAsyncDocument.resolver.resolved;
    }
  });

  const mounted = useMountedRef();

  const loadDocument = useCallback(async () => {
    if (!isDocumentNode(documentOrAsyncDocument)) {
      try {
        const resolved = await documentOrAsyncDocument.resolver.resolve();
        if (mounted.current) {
          setDocument(resolved);
        }
      } catch (error) {
        throw Error('error loading GraphQL document');
      }
    }
  }, [documentOrAsyncDocument, mounted]);

  useEffect(() => {
    if (!document) {
      loadDocument();
    }
  }, [document, loadDocument]);

  useAsyncAsset(
    isDocumentNode(documentOrAsyncDocument)
      ? undefined
      : documentOrAsyncDocument.resolver.id,
  );

  return document;
}

function isDocumentNode(arg: any): arg is DocumentNode {
  return Boolean(arg && arg.kind && arg.kind === 'Document');
}
