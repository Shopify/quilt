import {ReactElement} from 'react';
import reactTreeWalker from 'react-tree-walker';
import {isExtractable, METHOD_NAME} from './extractable';

const defaultContext = {
  reactExtractRunning: true,
};

export function extract(
  app: ReactElement<any>,
  include: symbol[] | boolean = true,
) {
  return reactTreeWalker(
    app,
    (_, instance) => {
      return isExtractable(instance)
        ? instance[METHOD_NAME](include)
        : undefined;
    },
    {...defaultContext},
  );
}
