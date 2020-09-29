import {CspDirective} from '@shopify/network';

import {useCspDirective} from '../hooks';

interface Props {
  types: string | string[];
}

export default function PluginTypes({types}: Props) {
  useCspDirective(CspDirective.PluginTypes, types);
  return null;
}
