import * as React from 'react';
import {CspDirective} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  sources: string | string[];
}

export default function FormAction({sources}: Props) {
  return (
    <SetCspDirective directive={CspDirective.FormAction} value={sources} />
  );
}
