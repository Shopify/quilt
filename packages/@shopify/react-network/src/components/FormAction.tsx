import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  sources: string | string[];
}

export default function FormAction({sources}: Props) {
  useCspDirective(CspDirective.FormAction, sources);
  return null;
}
