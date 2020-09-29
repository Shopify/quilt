import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function PrefetchSource({sources}: Props) {
  useCspDirective(CspDirective.PrefetchSrc, sources);
  return null;
}
