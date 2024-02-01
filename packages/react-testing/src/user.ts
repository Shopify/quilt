const user = {
  click(element: HTMLElement) {},
  change(element: HTMLElement) {},
  focus(element: HTMLElement) {},
};
const button = root.getByText(/click me/i);
user.clicks(button);
user.inputs(input, true);
user.inputs(input, 'hello');
user.focuses(button);

user.hovers(button);
user.selects(select, 'option1');

export default user;
