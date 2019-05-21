import * as React from 'react';
import {useLazyRef} from '@shopify/react-hooks';
import {HydrationContext} from './context';
import {HYDRATION_ATTRIBUTE} from './shared';

interface Props {
  id?: string;
  children?: React.ReactNode;
}

export const Hydrator = React.memo(function Hydrator({children, id}: Props) {
  const manager = React.useContext(HydrationContext);
  const hydrationId = useLazyRef(() => manager.hydrationId(id)).current;
  const hydrationProps = {[HYDRATION_ATTRIBUTE]: hydrationId};

  return children ? (
    <div {...hydrationProps}>{children}</div>
  ) : (
    <div
      {...hydrationProps}
      dangerouslySetInnerHTML={{
        __html: manager.getHydration(hydrationId) || '',
      }}
    />
  );
});
