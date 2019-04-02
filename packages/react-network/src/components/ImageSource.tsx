import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function ImageSource({sources}: Props) {
  useCspDirective(CspDirective.ImgSrc, sources);
  return null;
}
