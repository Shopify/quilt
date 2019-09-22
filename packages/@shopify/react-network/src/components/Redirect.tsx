import {StatusCode} from '@shopify/network';
import {useRedirect} from '../hooks';

interface Props {
  url: string;
  code?: StatusCode;
}

export default function Redirect({url, code}: Props) {
  useRedirect(url, code);
  return null;
}
