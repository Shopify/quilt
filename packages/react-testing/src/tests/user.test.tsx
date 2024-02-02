/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable @shopify/jsx-prefer-fragment-wrappers */
/* eslint-disable react/button-has-type */
import React from 'react';

import {mount} from '../mount';
import user from '../user';
import {getByLabelText, getByText, queryByText} from '../queries';

describe('click', () => {
  it('clicks on a button', () => {
    const onClick = jest.fn();
    mount(<button onClick={onClick}>click me</button>);
    user.click(getByText('click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('doesn’t click on a disabled button', () => {
    const onClick = jest.fn();
    mount(
      <button disabled onClick={onClick}>
        click me
      </button>,
    );
    user.click(getByText('click me'));
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
    mount(<Counter />);
    user.click(getByText('click me'));
    expect(getByText('clicked')).toBeInDocument();
  });
});

describe('hover', () => {
  it('hovering over an element calls onMouseEnter', () => {
    const onMouseEnter = jest.fn();
    mount(<div onMouseEnter={onMouseEnter}>hover me</div>);
    user.hover(getByText('hover me'));
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
    mount(<Wrapper />);
    user.hover(getByText('Please hover me'));
    expect(getByText('tooltip')).toBeInDocument();
    user.unhover(getByText('Please hover me'));
    expect(queryByText('tooltip')).not.toBeInDocument();
  });
});

describe('focus', () => {
  it('focuses on an input', () => {
    mount(<input aria-label="text" />);
    user.focus(getByLabelText('text'));
    expect(getByLabelText('text')).toHaveFocus();
  });

  it('focuses on a React component input', () => {
    const Input = () => <input aria-label="text" />;
    mount(<Input />);
    user.focus(getByLabelText('text'));
    expect(getByLabelText('text')).toHaveFocus();
  });

  it('calls onfocus event when focusing an element', () => {
    const onFocus = jest.fn();
    mount(<input aria-label="text" onFocus={onFocus} />);
    user.focus(getByLabelText('text'));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('buttons can be focused', () => {
    mount(<button>text</button>);
    user.focus(getByText('text'));
    expect(getByText('text')).toHaveFocus();
  });

  it('triggers focused button click using enter key', () => {
    const onClick = jest.fn();
    mount(<button onClick={onClick}>click me</button>);
    user.focus(getByText('click me'));
    user.keyboard.press('Enter');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('removes focus when an element is blurred', () => {
    const onBlur = jest.fn();
    mount(<input aria-label="text" onBlur={onBlur} />);
    user.focus(getByLabelText('text'));
    user.blur(getByLabelText('text'));
    expect(getByLabelText('text')).not.toHaveFocus();
  });

  it('fires blur event when an element is blurred', () => {
    const onBlur = jest.fn();
    mount(<input aria-label="text" onBlur={onBlur} />);
    user.focus(getByLabelText('text'));
    user.blur(getByLabelText('text'));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe('inputs', () => {
  it('changes the value of an input', () => {
    mount(<input aria-label="text" />);
    user.inputs(getByLabelText('text'), 'hello');
    expect(getByLabelText('text')).toHaveValue('hello');
  });

  it('changes the value of a checkbox', () => {
    mount(<input type="checkbox" aria-label="checkbox" />);
    user.inputs(getByLabelText('checkbox'), true);
    expect(getByLabelText('checkbox')).toHaveValue(true);
  });

  it('changes the value of a textarea', () => {
    mount(<textarea aria-label="text" />);
    user.inputs(getByLabelText('text'), 'hello');
    expect(getByLabelText('text')).toHaveValue('hello');
  });

  it('changes the value of a radio input', () => {
    mount(
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
    user.inputs(getByLabelText('first'), true);
    expect(getByLabelText('first')).toHaveValue(true);
    expect(getByLabelText('second')).toHaveValue(false);
  });
});

describe('selects', () => {
  it('selects an element in a select input based on text', () => {
    mount(
      <select aria-label="select">
        <option value="1">one</option>
        <option value="2">two</option>
      </select>,
    );
    user.selects(getByLabelText('select'), getByText('two'));
    expect(getByLabelText('select')).toHaveValue('2');
  });
});
