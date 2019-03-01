import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  value?: boolean;
}

export default function BlockAllMixedContent({value = true}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.BlockAllMixedContent, value),
  );

  return null;
}
