import * as React from 'react';
import {CspDirective} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  value?: boolean;
}

export default function UpgradeInsecureRequests({value = true}: Props) {
  return (
    <SetCspDirective
      directive={CspDirective.UpgradeInsecureRequests}
      value={value}
    />
  );
}
