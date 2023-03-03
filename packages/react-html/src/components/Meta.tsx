import type {HTMLProps} from 'react';

import {useMeta} from '../hooks';

type Props = HTMLProps<HTMLMetaElement>;

export function Meta(props: Props) {
  useMeta(props);
  return null;
}
