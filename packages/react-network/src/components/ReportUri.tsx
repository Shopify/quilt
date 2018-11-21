import * as React from 'react';
import {CspDirective} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  uri: string;
}

export default function ReportUri({uri}: Props) {
  return <SetCspDirective directive={CspDirective.ReportUri} value={uri} />;
}
