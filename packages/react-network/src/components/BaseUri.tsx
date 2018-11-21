import * as React from 'react';
import {CspDirective} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  uri: string;
}

export default function BaseUri({uri}: Props) {
  return <SetCspDirective directive={CspDirective.BaseUri} value={uri} />;
}
