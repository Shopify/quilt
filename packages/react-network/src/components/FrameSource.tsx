import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function FrameSource({sources}: Props) {
  useCspDirective(CspDirective.FrameSrc, sources);
  return null;
}
