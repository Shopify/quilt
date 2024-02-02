import {queryAllByLabelText, queryAllByText} from './queryBy';
import {MoreThanOneMatch, NoMatchFound} from './utilities';

export function getAllByText(matcher: string | RegExp): HTMLElement[] {
  const matches = queryAllByText(matcher);

  if (matches.length === 0) throw new NoMatchFound(matcher);

  return matches;
}
export function getByText(matcher: string | RegExp): HTMLElement {
  const matches = getAllByText(matcher);

  if (matches.length > 1) throw new MoreThanOneMatch(matcher, 'getAllByText');

  return matches[0];
}

export function getAllByLabelText(matcher: string | RegExp): HTMLElement[] {
  const matches = queryAllByLabelText(matcher);
  if (matches.length === 0) throw new NoMatchFound(matcher);

  return matches;
}
export function getByLabelText(matcher: string | RegExp): HTMLElement {
  const matches = getAllByLabelText(matcher);
  if (matches.length > 1) {
    throw new MoreThanOneMatch(matcher, 'getAllByLabelText');
  }

  return matches[0];
}
