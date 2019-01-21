import * as React from 'react';
import DomEffect from './DomEffect';

type Props = React.HTMLProps<HTMLLinkElement>;

export default function Link(props: Props) {
  return (
    <DomEffect
      key={JSON.stringify(props)}
      perform={(manager) => manager.addLink(props)}
    />
  );
}
