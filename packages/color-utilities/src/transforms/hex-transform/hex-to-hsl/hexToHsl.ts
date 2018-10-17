import {hexToRgb, rgbToHsl} from '@transforms';

export default function hexToHsl(color: string) {
  const rgbColor = hexToRgb(color);
  return rgbToHsl(rgbColor);
}
