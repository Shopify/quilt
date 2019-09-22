import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function StyleSource({sources}: Props) {
  useCspDirective(CspDirective.StyleSrc, sources);
  return null;
}
