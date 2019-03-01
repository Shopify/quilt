import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function FrameSource({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.FrameSrc, sources),
  );

  return null;
}
