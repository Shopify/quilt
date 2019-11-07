import React from 'react';

import {useLink} from '../hooks';

type Props = React.HTMLProps<HTMLLinkElement>;

export function Link(props: Props) {
  useLink(props);
  return null;
}
