import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function ManifestSource({sources}: Props) {
  useCspDirective(CspDirective.ManifestSrc, sources);
  return null;
}
