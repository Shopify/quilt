import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function ScriptSource({sources}: Props) {
  useCspDirective(CspDirective.ScriptSrc, sources);
  return null;
}
