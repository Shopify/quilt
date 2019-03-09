import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function StyleSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.StyleSrc, sources),
  );

  return null;
}
