import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  uri: string;
}

export default function ReportUri({uri}: Props) {
  useCspDirective(CspDirective.ReportUri, uri);
  return null;
}
