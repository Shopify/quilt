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
};
// const button = root.getByText(/click me/i);
// user.clicks(button);
// user.inputs(input, true);
// user.inputs(input, 'hello');
// user.focuses(button);
// user.hovers(button);
// user.selects(select, 'option1');

export default user;
