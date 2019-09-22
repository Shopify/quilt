import {useFavicon} from '../hooks';

interface Props {
  source: string;
}

export function Favicon({source}: Props) {
  useFavicon(source);
  return null;
}
