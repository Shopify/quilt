/**
 * @returns A trimmed non-empty value.  If the trimmed value is empty, undefined is returned
 */
export function nonEmptyOrUndefined(input?: string | null): string | undefined {
  if (input && input.trim().length) {
    return input.trim();
  }

  return undefined;
}
