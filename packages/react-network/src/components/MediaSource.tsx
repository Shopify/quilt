import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function MediaSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.MediaSrc, sources),
  );

  return null;
}
