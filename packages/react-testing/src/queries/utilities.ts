export function fuzzyMatch(
  nodeText: string | null,
  matcher: string | RegExp,
): boolean {
  if (nodeText === '' || nodeText === null) return false;

  if (typeof matcher === 'string') {
    return nodeText.includes(matcher);
  } else {
    return matcher.test(nodeText);
  }
}

export function getNodeText(node: HTMLElement): string {
  if (
    node instanceof HTMLInputElement &&
    node.matches('input[type=submit], input[type=button], input[type=reset]')
  ) {
    return node.value;
  }

  return Array.from(node.childNodes)
    .filter((child) => child.nodeType === 3 && Boolean(child.textContent))
    .map((child) => child.textContent)
    .join('');
}

export function checkIfElementIsAnInput(element: HTMLElement) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

export function inspectMatcher(matcher: string | RegExp): string {
  return typeof matcher === 'string' ? `"${matcher}"` : `${matcher}`;
}

export class MoreThanOneMatch extends Error {
  constructor(matcher: string | RegExp, suggestedQueryFn: string) {
    const message = `Found more than one match for ${inspectMatcher(
      matcher,
    )}. Did you mean to use \`${suggestedQueryFn}\`?`;
    super(message);
  }
}

export class NoMatchFound extends Error {
  constructor(matcher: string | RegExp) {
    const message = `No match found for ${inspectMatcher(
      matcher,
    )}. Are you sure that it's rendered?`;
    super(message);
  }
}
