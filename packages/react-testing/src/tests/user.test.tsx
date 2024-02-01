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
