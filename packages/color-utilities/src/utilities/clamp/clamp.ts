export default function clamp(number: number, lower: number, upper: number) {
  if (number < lower) return lower;
  if (number > upper) return upper;
  return number;
}
