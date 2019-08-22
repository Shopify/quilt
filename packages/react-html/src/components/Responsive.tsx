import {useMeta} from '../hooks';

interface Props {
  coverNotch?: boolean;
  allowPinchToZoom?: boolean;
}

export function Responsive({
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

  useMeta({
    name: 'viewport',
    content: viewportParts.join(', '),
  });

  return null;
}
