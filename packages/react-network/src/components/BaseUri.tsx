import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  uri: string;
}

export default function BaseUri({uri}: Props) {
  useCspDirective(CspDirective.BaseUri, uri);
  return null;
}
