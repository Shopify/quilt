import * as React from 'react';
import {useDomEffect} from '../hook';

type Props = React.HTMLProps<HTMLMetaElement>;

export default function Meta(props: Props) {
  useDomEffect(manager => manager.addMeta(props), [JSON.stringify(props)]);
  return null;
}
