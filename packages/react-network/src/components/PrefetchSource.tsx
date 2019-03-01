import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function PrefetchSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.PrefetchSrc, sources),
  );

  return null;
}
