import type {HTMLProps} from 'react';

import {useLink} from '../hooks';

type Props = HTMLProps<HTMLLinkElement>;

export function Link(props: Props) {
  useLink(props);
  return null;
}
