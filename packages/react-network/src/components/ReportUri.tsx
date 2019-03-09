import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  uri: string;
}

export default function ReportUri({uri}: Props) {
  useNetworkEffect(network =>
    network.addCspDirective(CspDirective.ReportUri, uri),
  );

  return null;
}
