import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  value?: boolean;
}

export default function UpgradeInsecureRequests({value = true}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.UpgradeInsecureRequests, value),
  );

  return null;
}
