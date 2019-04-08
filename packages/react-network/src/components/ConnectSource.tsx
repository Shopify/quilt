import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function ConnectSource({sources}: Props) {
  useCspDirective(CspDirective.ConnectSrc, sources);
  return null;
}
