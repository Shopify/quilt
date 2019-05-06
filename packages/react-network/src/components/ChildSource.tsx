import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function ChildSource({sources}: Props) {
  useCspDirective(CspDirective.ChildSrc, sources);
  return null;
}
