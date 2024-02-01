/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/button-has-type */
import React from 'react';

import {mount} from '../mount';
import user from '../user';

describe('demo', () => {
  it('fills out a form and submits', () => {
    const onSubmit = jest.fn();
    const root = mount(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const data = Object.fromEntries(formData);
          onSubmit(data);
        }}
      >
        <label>
          Email:
          <input name="email" />
        </label>
        <label>
          Name:
          <input name="firstName" />
        </label>
        <label>
          Eye color:
          <select name="eyeColor">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
        </label>
        <label>
          Bio:
          <textarea name="bio" />
        </label>
        <button>submit</button>
      </form>,
    );

    // user.inputs('testing@shopify.com').into(root.getByLabelText('Email'));
    user.inputs(getByLabelText('Email'), 'testing@shopify.com');
    user.inputs(root.getByLabelText('Name'), 'Matt');
    user.selects(root.getByLabelText('Eye color'), root.getByText('Green'));
    user.inputs(root.getByLabelText('Bio'), 'I am a developer');
    user.click(root.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'testing@shopify.com',
      firstName: 'Matt',
      bio: 'I am a developer',
      eyeColor: 'green',
    });
  });
});

function getByLabelText(matcher: string | RegExp) {
  const matches = getAllByLabelText(matcher);

  if (matches.length > 1) {
    throw new Error(
      `found more than one match for ${matcher}. Did you mean to call \`getAllByLabelText\`?`,
    );
  } else if (matches.length === 0) {
    throw new Error(`Unable to find any elements with the label: ${matcher}`);
  }
  return matches[0];
}

function getAllByLabelText(matcher: string | RegExp): HTMLElement[] {
  const root = document;

  if (!root) {
    throw new Error(`expected an element to be mounted in getByLabelText`);
  }

  let elements: HTMLElement[] = [];

  // if aria-label is matcher, return the element control
  elements = Array.from(root.querySelectorAll<HTMLElement>('*'))
    .filter((element) => {
      if (
        checkIfElementIsAnInput(element) &&
        fuzzyMatch(element.getAttribute('aria-label'), matcher)
      ) {
        return true;
      }

      const labelElement = root.getElementById(
        element.getAttribute('aria-labelledby') ?? '',
      );
      if (
        labelElement &&
        checkIfElementIsAnInput(labelElement) &&
        fuzzyMatch(getNodeText(labelElement), matcher)
      )
        return true;

      if (fuzzyMatch(getNodeText(element), matcher)) return true;

      return false;
    })
    .map((element) => {
      if (checkIfElementIsAnInput(element)) {
        return element;
      }

      if (element instanceof HTMLLabelElement) {
        return element.control!;
      }
      return element.closest('label')?.control!;
    })
    .filter(Boolean) as HTMLElement[];

  if (elements.length === 0) {
    throw new Error(`Unable to find any elements with the label: ${matcher}`);
  }
  return elements;
}

function fuzzyMatch(
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

function getNodeText(node: HTMLElement): string {
  if (
    node.matches('input[type=submit], input[type=button], input[type=reset]')
  ) {
    return (node as HTMLInputElement).value;
  }

  return Array.from(node.childNodes)
    .filter((child) => child.nodeType === 3 && Boolean(child.textContent))
    .map((child) => child.textContent)
    .join('');
}

function checkIfElementIsAnInput(element: HTMLElement) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}
