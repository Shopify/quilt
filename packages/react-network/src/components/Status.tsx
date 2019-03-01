import {StatusCode} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  code: StatusCode;
}

export default function Status({code}: Props) {
  useNetworkEffect((network) => network.addStatusCode(code));
  return null;
}
