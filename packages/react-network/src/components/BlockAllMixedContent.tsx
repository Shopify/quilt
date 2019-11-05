import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  value?: boolean;
}

export default function BlockAllMixedContent({value = true}: Props) {
  useCspDirective(CspDirective.BlockAllMixedContent, value);
  return null;
}
