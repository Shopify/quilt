import * as React from 'react';
import DomEffect from './DomEffect';

type Props = React.HTMLProps<HTMLMetaElement>;

export default function Meta(props: Props) {
  return (
    <DomEffect
      key={JSON.stringify(props)}
      perform={(manager) => manager.addMeta(props)}
    />
  );
}
