import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function WebRtcSource({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.WebrtcSrc, sources),
  );

  return null;
}
