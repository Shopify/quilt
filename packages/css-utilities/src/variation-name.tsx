export function variationName<Variant extends string | number>(
  name: string,
  value: Variant,
) {
  const valuePortion =
    typeof value === 'number'
      ? String(value)
      : `${value[0].toUpperCase()}${value.substring(1)}`;
  return `${name}${valuePortion}`;
}
