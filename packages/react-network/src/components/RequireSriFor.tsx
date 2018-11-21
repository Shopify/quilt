import * as React from 'react';
import {CspDirective, SriAsset} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  scripts?: boolean;
  styles?: boolean;
}

export default function RequireSriFor({scripts, styles}: Props) {
  const value: SriAsset[] = [];

  if (scripts) {
    value.push(SriAsset.Script);
  }

  if (styles) {
    value.push(SriAsset.Style);
  }

  return (
    <SetCspDirective directive={CspDirective.RequireSriFor} value={value} />
  );
}
