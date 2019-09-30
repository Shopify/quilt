export function hasDocumentCookie() {
  return Boolean(
    typeof document === 'object' && typeof document.cookie === 'string',
  );
}
