import type {HTMLProps} from 'react';

import {useInlineStyle} from '../hooks';

type Props = HTMLProps<HTMLStyleElement>;

export function InlineStyle(props: Props) {
  useInlineStyle(props);
  return null;
}
