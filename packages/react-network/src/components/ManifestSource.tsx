import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function ManifestSource({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.ManifestSrc, sources),
  );

  return null;
}
