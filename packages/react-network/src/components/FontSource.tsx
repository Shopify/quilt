import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function FontSource({sources}: Props) {
  useCspDirective(CspDirective.FontSrc, sources);
  return null;
}
