import {useState, useEffect, useCallback} from 'react';
import {OperationVariables} from '@apollo/client';
import {DocumentNode} from 'graphql-typed';
import {useMountedRef} from '@shopify/react-hooks';
import {useAsyncAsset} from '@shopify/react-async';

import {AsyncDocumentNode} from '../types';

export default function useGraphQLDocument<
  Data = any,
  Variables = OperationVariables,
  DeepPartial = {}
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
