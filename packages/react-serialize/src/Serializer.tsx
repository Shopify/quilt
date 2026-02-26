import * as React from 'react';
import serialize from 'serialize-javascript';
import {serializedID} from './utilities';

export interface Props {
  id: string;
  data: any;
  details?: {[key: string]: any};
}

export default function Serializer({id, data, details}: Props) {
  const additionalProps = details
    ? {'data-serialized-details': serialize(details)}
    : {};

  return (
    <script
      type="text/json"
      id={serializedID(id)}
      dangerouslySetInnerHTML={{__html: serialize(data)}}
      {...additionalProps}
    />
  );
}
