import * as React from 'react';
import {CspDirective} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  types: string | string[];
}

export default function PluginTypes({types}: Props) {
  return <SetCspDirective directive={CspDirective.PluginTypes} value={types} />;
}
