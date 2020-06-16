import React from 'react';
import {EmptyState} from '@shopify/polaris';
import {usePerformanceMark, Stage} from '@shopify/react-performance';
import {useI18n} from '@shopify/react-i18n';

import {emptyStateIllustration} from './illustrations';

export default function Home() {
  usePerformanceMark(Stage.Complete, 'Home');
  const [i18n] = useI18n();

  return (
    <>
      <EmptyState
        heading={i18n.translate('heading')}
        image={emptyStateIllustration}
        footerContent={i18n.translate('footerContent', {
          path: 'app/ui/features/Home/Home.tsx',
        })}
      />
    </>
  );
}
