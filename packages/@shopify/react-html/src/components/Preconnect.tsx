import {usePreconnect} from '../hooks';

interface Props {
  source: string;
}

export function Preconnect({source}: Props) {
  usePreconnect(source);
  return null;
}
