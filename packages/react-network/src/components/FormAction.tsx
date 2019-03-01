import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function FormAction({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.FormAction, sources),
  );

  return null;
}
