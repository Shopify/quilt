import {parse} from 'graphql';
import {useState, useEffect} from 'react';
import {OperationVariables} from 'apollo-client';
import {DocumentNode, SimpleDocument} from 'graphql-typed';
import {useMountedRef} from '@shopify/react-hooks';
import {useAsyncAsset} from '@shopify/react-async';

import {AsyncDocumentNode, QueryDocument, PossiblyAsyncQuery} from '../types';

export default function useGraphQLDocument<
  Data = any,
  Variables = OperationVariables,
  DeepPartial = {}
>(
  documentOrAsyncDocument: PossiblyAsyncQuery<Data, Variables, DeepPartial>,
): DocumentNode<Data, Variables> | null {
  const [document, setDocument] = useState<DocumentNode<
    Data,
    Variables
  > | null>(() => {
    const doc = isAsync(documentOrAsyncDocument)
      ? documentOrAsyncDocument.resolver.resolved
      : documentOrAsyncDocument;

    if (doc == null) {
      return doc;
    } else {
      return normalizeDocument(doc as QueryDocument<Data, Variables>);
    }
  });

  const mounted = useMountedRef();

  useEffect(() => {
    if (!document && isAsync(documentOrAsyncDocument)) {
      (async () => {
        try {
          const resolved = (await documentOrAsyncDocument.resolver.resolve()) as QueryDocument<
            Data,
            Variables,
            DeepPartial
          >;
          if (mounted.current) {
            setDocument(normalizeDocument(resolved));
          }
        } catch (error) {
          throw Error('error loading GraphQL document');
        }
      })();
    }
  }, [document, documentOrAsyncDocument, mounted]);

  useAsyncAsset(
    isAsync(documentOrAsyncDocument)
      ? documentOrAsyncDocument.resolver.id
      : undefined,
  );

  return document;
}

export function normalizeDocument<Data, Variables, DeepPartial = {}>(
  document: QueryDocument<Data, Variables, DeepPartial>,
) {
  if (isSimpleDocument(document)) {
    return desimplify(document);
  } else {
    return document;
  }
}

function desimplify<Data, Variables, DeepPartial = {}>(
  doc: SimpleDocument<Data, Variables, DeepPartial>,
): DocumentNode<Data, Variables, DeepPartial> {
  const start = performance.now();
  const parsedDoc = parse(doc.source);
  const interval = performance.now() - start;
  console.log(
    'Parsing document',
    doc.name || 'anonymous',
    'took',
    interval,
    'ms',
  );

  return {
    id: doc.id,
    ...parsedDoc,
  };
}

function isAsync<Data, Variables, DeepPartial = {}>(
  arg: any,
): arg is AsyncDocumentNode<Data, Variables, DeepPartial> {
  return 'resolver' in arg;
}

export function isSimpleDocument<Data, Variables, DeepPartial = {}>(
  doc: any,
): doc is SimpleDocument<Data, Variables, DeepPartial> {
  return (
    typeof doc === 'object' && 'id' in doc && 'source' in doc && 'name' in doc
  );
}
