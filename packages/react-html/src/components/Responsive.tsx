import * as React from 'react';
import Meta from './Meta';

interface Props {
  coverNotch?: boolean;
  allowPinchToZoom?: boolean;
}

export default function Responsive({
  coverNotch = true,
  allowPinchToZoom = true,
}: Props) {
  const viewportParts = ['width=device-width', 'initial-scale=1'];

  if (coverNotch) {
    viewportParts.push('viewport-fit=cover');
  }

  if (!allowPinchToZoom) {
    viewportParts.push('user-scalable=no');
  }

  return <Meta name="viewport" content={viewportParts.join(', ')} />;
}
