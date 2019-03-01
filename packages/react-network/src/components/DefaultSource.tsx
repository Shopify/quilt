import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function DefaultSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.DefaultSrc, sources),
  );

  return null;
}
