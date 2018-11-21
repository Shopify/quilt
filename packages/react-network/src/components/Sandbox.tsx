import * as React from 'react';
import {CspDirective, CspSandboxAllow} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  allowed: CspSandboxAllow | CspSandboxAllow[];
}

export default function Sandbox({allowed}: Props) {
  return <SetCspDirective directive={CspDirective.Sandbox} value={allowed} />;
}
