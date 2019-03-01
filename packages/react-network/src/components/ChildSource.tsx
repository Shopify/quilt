import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function ChildSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.ChildSrc, sources),
  );

  return null;
}
