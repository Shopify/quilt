import * as React from 'react';
import reactTreeWalker from 'react-tree-walker';
import Manager, {ExtractedTranslations} from './manager';

export default async function getTranslationsFromTree(
  tree: React.ReactElement<any>,
): Promise<ExtractedTranslations> {
  let manager: Manager | undefined;

  await reactTreeWalker(
    tree,
    (_element, _instance, context?: {i18nManager?: any}) => {
      if (
        manager == null &&
        context &&
        context.i18nManager &&
        context.i18nManager instanceof Manager
      ) {
        manager = context.i18nManager;
      }
    },
  );

  return manager ? manager.extract() : {};
}
