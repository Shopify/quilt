import {Readable} from 'stream';
import {ReactElement} from 'react';
import {renderToStaticNodeStream} from 'react-dom/server';
import Multistream from 'multistream';

export default function stream(tree: ReactElement<unknown>) {
  const doctype = new Readable();
  doctype.push('<!DOCTYPE html>');
  doctype.push(null);

  return new Multistream([doctype, renderToStaticNodeStream(tree)]);
}
