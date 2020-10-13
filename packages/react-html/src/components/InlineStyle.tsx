import React from 'react';

import {useInlineStyle} from '../hooks';

type Props = React.HTMLProps<HTMLStyleElement>;

export function InlineStyle(props: Props) {
  useInlineStyle(props);
  return null;
}
