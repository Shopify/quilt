import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function WorkerSource({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.WorkerSrc, sources),
  );

  return null;
}
