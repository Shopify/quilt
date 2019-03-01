import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function FontSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.FontSrc, sources),
  );

  return null;
}
