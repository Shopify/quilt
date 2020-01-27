import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function ObjectSource({sources}: Props) {
  useCspDirective(CspDirective.ObjectSrc, sources);
  return null;
}
