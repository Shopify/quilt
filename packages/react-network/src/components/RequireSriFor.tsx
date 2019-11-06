import {CspDirective, SriAsset} from '@shopify/network';

import {useCspDirective} from '../hooks';

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

  useCspDirective(CspDirective.RequireSriFor, value);

  return null;
}
