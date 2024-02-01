/* eslint-disable @typescript-eslint/no-namespace */
import {act} from 'react-dom/test-utils';

const user = {
  click(element: HTMLElement) {
    act(() => {
      element.click();
    });
  },
  hover(element: HTMLElement) {
    act(() => {
      element.dispatchEvent(new MouseEvent('mouseover', {bubbles: true}));
      element.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
    });
  },
  unhover(element: HTMLElement) {
    act(() => {
      element.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      element.dispatchEvent(new MouseEvent('mouseout', {bubbles: true}));
    });
  },
  inputs(element: HTMLElement, value: string | boolean) {
    if (
      !(element instanceof HTMLInputElement) &&
      !(element instanceof HTMLTextAreaElement)
    ) {
      throw new Error(
        'inputs can only be called on input or textarea elements',
      );
    }
    act(() => {
      if (typeof value === 'string') {
        (element as HTMLInputElement).value = value;
      } else {
        (element as HTMLInputElement).checked = value;
      }
      element.dispatchEvent(new Event('input', {bubbles: true}));
    });
  },
  selects(element: HTMLElement, option: HTMLElement) {
    if (
      !(element instanceof HTMLSelectElement) ||
      !(option instanceof HTMLOptionElement)
    ) {
      throw new Error(
        'selects can only be called on select and option elements',
      );
    }
    act(() => {
      element.value = option.value;
      element.dispatchEvent(new Event('change', {bubbles: true}));
    });
  },
  focus(element: HTMLElement) {
    act(() => {
      element.focus();
    });
  },
  blur(element: HTMLElement) {
    act(() => {
      element.blur();
    });
  },
  keyboard,
};

function keyboard(option: KeyboardEventInit) {
  if (!document.activeElement) {
    throw new Error('no focused element');
  }
  if (option.key === 'Enter') {
    user.click(document.activeElement as HTMLElement);
  } else {
    act(() => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', option),
      );
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keypress', option),
      );
      document.activeElement?.dispatchEvent(new KeyboardEvent('keyup', option));
    });
  }
}
namespace keyboard {
  export function press(key: string): void {
    user.keyboard({key});
  }
}

export default user;
