import {hexToRgb, rgbToHsb} from '@transforms';

export default function hexToHsb(color: string) {
  const rgbColor = hexToRgb(color);
  return rgbToHsb(rgbColor);
}
