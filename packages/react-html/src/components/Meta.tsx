import React from 'react';
import {useMeta} from '../hooks';

type Props = React.HTMLProps<HTMLMetaElement>;

export function Meta(props: Props) {
  useMeta(props);
  return null;
}
