import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function ConnectSource({sources}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.ConnectSrc, sources),
  );

  return null;
}
