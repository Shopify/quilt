import type {CspSandboxAllow} from '@shopify/network';
import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  allowed: CspSandboxAllow | CspSandboxAllow[];
}

export default function Sandbox({allowed}: Props) {
  useCspDirective(CspDirective.Sandbox, allowed);
  return null;
}
