import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  types: string | string[];
}

export default function PluginTypes({types}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.PluginTypes, types),
  );

  return null;
}
