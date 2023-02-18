import React from 'react';
import jsesc from 'jsesc';

import {SERIALIZE_ATTRIBUTE} from '../../utilities';

interface Props {
  id: string;
  data: any;
}

export default function Serialize({id, data}: Props) {
  const serialized = jsesc(data, {
    isScriptContext: true,
    json: true,
  });

  return (
    <script
      type="text/json"
      dangerouslySetInnerHTML={{__html: serialized}}
      {...{[SERIALIZE_ATTRIBUTE]: id}}
    />
  );
}
