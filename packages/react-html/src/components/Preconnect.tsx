import {useLink} from '../hooks';

interface Props {
  source: string;
}

export function Preconnect({source}: Props) {
  useLink({rel: 'dns-prefetch preconnect', href: source});
  return null;
}
