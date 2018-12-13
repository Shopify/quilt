import {ReactElement} from 'react';
import {traverse} from '@shopify/react-traverse-nodes';
import {isExtractable, METHOD_NAME} from './extractable';

const defaultContext = {
  reactExtractRunning: true,
};

export interface Middleware {
  (instance): any;
}

export function extract(
  app: ReactElement<any>,
  include: symbol[] | boolean = true,
  middleware: Middleware[] = [],
) {
  const extractors = [
    instance =>
      isExtractable(instance) ? instance[METHOD_NAME](include) : undefined,
    ...middleware,
  ];
  return traverse(
    app,
    (_, instance) =>
      Promise.all(
        extractors.map(extractor => Promise.resolve(extractor(instance))),
      ),
    {...defaultContext},
  );
}
