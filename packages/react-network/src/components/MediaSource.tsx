import * as React from 'react';
import {CspDirective} from '@shopify/network';
import SetCspDirective from './SetCspDirective';

interface Props {
  sources: string | string[];
}

export default function MediaSource({sources}: Props) {
  return <SetCspDirective directive={CspDirective.MediaSrc} value={sources} />;
}
