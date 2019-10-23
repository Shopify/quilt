import React from 'react';
import serialize from 'serialize-javascript';
import {SERIALIZE_ATTRIBUTE} from '../../utilities';

interface Props {
  id: string;
  data: any;
}

export default function Serialize({id, data}: Props) {
  return (
    <script
      type="text/json"
      dangerouslySetInnerHTML={{__html: serialize(data)}}
      {...{[SERIALIZE_ATTRIBUTE]: id}}
    />
  );
}
