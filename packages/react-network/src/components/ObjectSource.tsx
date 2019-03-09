import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function ObjectSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.ObjectSrc, sources),
  );

  return null;
}
