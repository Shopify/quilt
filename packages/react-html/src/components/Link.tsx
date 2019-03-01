import * as React from 'react';
import {useDomEffect} from '../hook';

type Props = React.HTMLProps<HTMLLinkElement>;

export default function Link(props: Props) {
  useDomEffect((manager) => manager.addLink(props), [JSON.stringify(props)]);
  return null;
}
