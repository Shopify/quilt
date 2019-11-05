import {StatusCode} from '@shopify/network';

import {useStatus} from '../hooks';

interface Props {
  code: StatusCode;
}

export default function Status({code}: Props) {
  useStatus(code);
  return null;
}
