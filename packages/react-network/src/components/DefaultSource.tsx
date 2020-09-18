import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function DefaultSource({sources}: Props) {
  useCspDirective(CspDirective.DefaultSrc, sources);
  return null;
}
