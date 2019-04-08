import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function MediaSource({sources}: Props) {
  useCspDirective(CspDirective.MediaSrc, sources);
  return null;
}
