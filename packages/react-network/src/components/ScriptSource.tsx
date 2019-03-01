import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function ScriptSource({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.ScriptSrc, sources),
  );

  return null;
}
