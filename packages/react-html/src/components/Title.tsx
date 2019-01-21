import * as React from 'react';
import DomEffect from './DomEffect';

interface Props {
  children: string;
}

export default function Title({children: title}: Props) {
  return <DomEffect key={title} perform={manager => manager.addTitle(title)} />;
}
