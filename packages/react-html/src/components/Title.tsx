import {useTitle} from '../hooks';

interface Props {
  children: string;
}

export function Title({children: title}: Props) {
  useTitle(title);
  return null;
}
