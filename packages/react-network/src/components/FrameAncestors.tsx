import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function FrameAncestors({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.FrameAncestors, sources),
  );

  return null;
}
