import {CspDirective, CspSandboxAllow} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  allowed: CspSandboxAllow | CspSandboxAllow[];
}

export default function Sandbox({allowed}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.Sandbox, allowed),
  );

  return null;
}
