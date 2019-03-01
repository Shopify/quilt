import {useDomEffect} from '../hook';

interface Props {
  children: string;
}

export default function Title({children: title}: Props) {
  useDomEffect(manager => manager.addTitle(title), [title]);
  return null;
}
