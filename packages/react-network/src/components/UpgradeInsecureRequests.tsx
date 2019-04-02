import {CspDirective} from '@shopify/network';
import {useCspDirective} from '../hooks';

interface Props {
  value?: boolean;
}

export default function UpgradeInsecureRequests({value = true}: Props) {
  useCspDirective(CspDirective.UpgradeInsecureRequests, value);
  return null;
}
