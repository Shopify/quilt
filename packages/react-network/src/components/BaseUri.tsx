import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  uri: string;
}

export default function BaseUri({uri}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.BaseUri, uri),
  );

  return null;
}
