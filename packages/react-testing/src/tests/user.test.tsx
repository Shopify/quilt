/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable @shopify/jsx-prefer-fragment-wrappers */
/* eslint-disable react/button-has-type */
import React from 'react';

import {mount} from '../mount';
import user from '../user';

describe('click', () => {
  it('clicks on a button', () => {
    const onClick = jest.fn();
    const root = mount(<button onClick={onClick}>click me</button>);
    user.click(root.getByText('click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('doesn’t click on a disabled button', () => {
    const onClick = jest.fn();
    const root = mount(
      <button disabled onClick={onClick}>
        click me
      </button>,
    );
    user.click(root.getByText('click me'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('clicks a React component button and updates state', () => {
    const Counter = () => {
      const [clicked, setClicked] = React.useState(false);
      return (
        <>
          <button onClick={() => setClicked(true)}>click me</button>
          {clicked && 'clicked'}
        </>
      );
    };
    const root = mount(<Counter />);
    user.click(root.getByText('click me'));
    expect(root.getByText('clicked')).toBeInDocument();
  });
});

describe('hover', () => {
  it('hovering over an element calls onMouseEnter', () => {
    const onMouseEnter = jest.fn();
    const root = mount(<div onMouseEnter={onMouseEnter}>hover me</div>);
    user.hover(root.getByText('hover me'));
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('hovering a React element displays tooltip', () => {
    const Tooltip = () => (
      <div>
        <span>tooltip</span>
      </div>
    );
    const Wrapper = () => {
      const [hovering, setHovering] = React.useState(false);
      return (
        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => {
            setHovering(false);
          }}
        >
          Please hover me
          {hovering && <Tooltip />}
        </div>
      );
    };
    const root = mount(<Wrapper />);
    user.hover(root.getByText('Please hover me'));
    expect(root.getByText('tooltip')).toBeInDocument();
    user.unhover(root.getByText('Please hover me'));
    expect(root.queryByText('tooltip')).not.toBeInDocument();
  });
});

describe('focus', () => {
  it('focuses on an input', () => {
    const root = mount(<input aria-label="text" />);
    user.focus(root.getByLabelText('text'));
    expect(root.getByLabelText('text')).toHaveFocus();
  });

  it('focuses on a React component input', () => {
    const Input = () => <input aria-label="text" />;
    const root = mount(<Input />);
    user.focus(root.getByLabelText('text'));
    expect(root.getByLabelText('text')).toHaveFocus();
  });

  it('calls onfocus event when focusing an element', () => {
    const onFocus = jest.fn();
    const root = mount(<input aria-label="text" onFocus={onFocus} />);
    user.focus(root.getByLabelText('text'));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('buttons can be focused', () => {
    const root = mount(<button>text</button>);
    user.focus(root.getByText('text'));
    expect(root.getByText('text')).toHaveFocus();
  });

  it('triggers focused button click using enter key', () => {
    const onClick = jest.fn();
    const root = mount(<button onClick={onClick}>click me</button>);
    user.focus(root.getByText('click me'));
    user.keyboard.press('Enter');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('removes focus when an element is blurred', () => {
    const onBlur = jest.fn();
    const root = mount(<input aria-label="text" onBlur={onBlur} />);
    user.focus(root.getByLabelText('text'));
    user.blur(root.getByLabelText('text'));
    expect(root.getByLabelText('text')).not.toHaveFocus();
  });

  it('fires blur event when an element is blurred', () => {
    const onBlur = jest.fn();
    const root = mount(<input aria-label="text" onBlur={onBlur} />);
    user.focus(root.getByLabelText('text'));
    user.blur(root.getByLabelText('text'));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe('inputs', () => {
  it('changes the value of an input', () => {
    const root = mount(<input aria-label="text" />);
    user.inputs(root.getByLabelText('text'), 'hello');
    expect(root.getByLabelText('text')).toHaveValue('hello');
  });

  it('changes the value of a checkbox', () => {
    const root = mount(<input type="checkbox" aria-label="checkbox" />);
    user.inputs(root.getByLabelText('checkbox'), true);
    expect(root.getByLabelText('checkbox')).toHaveValue(true);
  });

  it('changes the value of a textarea', () => {
    const root = mount(<textarea aria-label="text" />);
    user.inputs(root.getByLabelText('text'), 'hello');
    expect(root.getByLabelText('text')).toHaveValue('hello');
  });

  it('changes the value of a radio input', () => {
    const root = mount(
      <div>
        <label>
          first
          <input type="radio" name="radio" value="1" />
        </label>
        <label>
          second
          <input type="radio" name="radio" value="2" />
        </label>
      </div>,
    );
    user.inputs(root.getByLabelText('first'), true);
    expect(root.getByLabelText('first')).toHaveValue(true);
    expect(root.getByLabelText('second')).toHaveValue(false);
  });
});

describe('selects', () => {
  it('selects an element in a select input based on text', () => {
    const root = mount(
      <select aria-label="select">
        <option value="1">one</option>
        <option value="2">two</option>
      </select>,
    );
    user.selects(root.getByLabelText('select'), root.getByText('two'));
    expect(root.getByLabelText('select')).toHaveValue('2');
  });
});
