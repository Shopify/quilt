import {StatusCode} from '@shopify/network';
import {useNetworkEffect} from '../hook';

interface Props {
  url: string;
  status?: StatusCode;
}

export default function Redirect({url, status}: Props) {
  useNetworkEffect(network => network.redirectTo(url, status));
  return null;
}
