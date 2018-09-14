/**
 * In Microsoft Edge, Intl.DateTimeFormat returns invisible characters
 * around the individual numbers.
 */
export function sanitiseDateString(string: String) {
  return string.replace(String.fromCharCode(8206), '');
}
