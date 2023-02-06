export function convertFirstSpaceToNonBreakingSpace(str: string) {
  return str.replace(' ', '\u00A0');
}
