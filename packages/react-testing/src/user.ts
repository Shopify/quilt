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
  change(element: HTMLElement) {},
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
