import {CspDirective} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  sources: string | string[];
}

export default function ImageSource({sources}: Props) {
  useNetworkEffect((network) =>
    network.addCspDirective(CspDirective.ImgSrc, sources),
  );

  return null;
}
