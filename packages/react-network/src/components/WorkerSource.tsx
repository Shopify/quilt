import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function WorkerSource({sources}: Props) {
  useCspDirective(CspDirective.WorkerSrc, sources);
  return null;
}
