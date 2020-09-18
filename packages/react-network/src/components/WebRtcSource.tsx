import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function WebRtcSource({sources}: Props) {
  useCspDirective(CspDirective.WebrtcSrc, sources);
  return null;
}
