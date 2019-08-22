import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function FrameAncestors({sources}: Props) {
  useCspDirective(CspDirective.FrameAncestors, sources);
  return null;
}
