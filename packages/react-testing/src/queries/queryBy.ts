import {fuzzyMatch, getNodeText, MoreThanOneMatch} from './utilities';

/**
 * Returns all HTMLElements that match by text or RegExp. This is helpful
 * for finding elements that visually display the text to users. In the case
 * of no matches, it retuns an empty array.
 */
export function queryAllByText(matcher: string | RegExp): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('*')).filter(
    (element) => fuzzyMatch(getNodeText(element), matcher),
  );
}

/**
 * Returns an HTMLElement if there is a single match by text or RegExp,
 * null if there is no match by text or RegExp, and throws an error if there
 * is more than one match by text or RegExp.
 */
export function queryByText(matcher: string | RegExp): HTMLElement | null {
  const matches = queryAllByText(matcher);

  if (matches.length > 1) {
    throw new MoreThanOneMatch(matcher, 'queryAllByText');
  }

  return matches[0] ?? null;
}

/**
 * Returns an array of HTMLElements for all matches by text or RegExp of either
 * the element's aria-label, the associated element's aria-labelledby,
 * an element's wrapped label, or the text contained in a descendant of ancestor
 * wrapping label.
 */
export function queryAllByLabelText(matcher: string | RegExp): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('*')).reduce<
    HTMLElement[]
  >((matches, element) => {
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const labelElement = ariaLabelledBy
      ? document.getElementById(ariaLabelledBy)
      : null;

    // element has aria-label with the matching text
    if (fuzzyMatch(element.getAttribute('aria-label'), matcher)) {
      console.log('pushing element: ', element.name);
      matches.push(element);
      // input has aria-labelledby pointing to an element with the matching text
    } else if (labelElement && fuzzyMatch(getNodeText(labelElement), matcher)) {
      console.log('pushing element: ', element.name);
      matches.push(element);
    } else if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const labels = Array.from(element.labels ?? []);
      const labelFound = labels.some((label) =>
        fuzzyMatch(getNodeText(label), matcher),
      );
      if (labelFound) {
        matches.push(element);
      }
    } else if (
      !(element instanceof HTMLLabelElement) &&
      fuzzyMatch(getNodeText(element), matcher)
    ) {
      // this is kind of a fall through case.
      // here we need to check if the element is inside of a label
      // and then if the label has an input it is controlling
      // if so then we return input

      const ancestorLabel = element.closest('label');
      const input = ancestorLabel?.control;
      if (input) {
        matches.push(input);
      }
    }

    return matches;
  }, []);
}

/**
 * Returns a singel HTMLElement that matches by text or RegExp of either
 * the element's aria-label, the associated element's aria-labelledby,
 * an element's wrapped label, or the text contained in a descendant of ancestor
 * wrapping label.
 *
 * If there is more than one match, it throws an error.
 *
 * If there are no matches, it returns null.
 */
export function queryByLabelText(matcher: string | RegExp): HTMLElement | null {
  const matches = queryAllByLabelText(matcher);
  if (matches.length > 1) {
    throw new MoreThanOneMatch(matcher, 'queryAllByLabelText');
  }

  return matches[0] ?? null;
}

// others we could implement
// queryByPlaceholerText
// queryByDisplayValue (for input | select | textarea values)
// queryByAltText
// queryByRole i.e. button, heading, tab, tablist, alert, etc.
// queryByTitle
// queryByTestId (probably the least important and also least encouraged)
