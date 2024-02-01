/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable @shopify/jsx-prefer-fragment-wrappers */
import React from 'react';

import {mount} from '../mount';

describe('getByText', () => {
  it('finds a text node', () => {
    const root = mount(<div>hello</div>);
    expect(root.getByText('hello')).toBeInDocument();
    expect(root.getByText(/hello/)).toBeInDocument();
  });

  it('finds a text node in React', () => {
    const Text = () => <div>hello</div>;
    const root = mount(<Text />);
    expect(root.getByText('hello')).toBeInDocument();
    expect(root.getByText(/hello/)).toBeInDocument();
  });

  it('finds a deeply nested text node', () => {
    const root = mount(
      <div>
        first
        <div>
          test
          <div>
            another<div>hello</div>
          </div>
        </div>
      </div>,
    );
    expect(root.getByText('hello')).toBeInDocument();
    expect(root.getByText(/hello/)).toBeInDocument();
  });

  it('throws if there are more than one text matches', () => {
    const root = mount(
      <div>
        <div>hello</div>
        <div>hello</div>
      </div>,
    );
    expect(() => root.getByText('hello')).toThrow(
      'found more than one match for hello. Did you mean to call `getAllByText`?',
    );
  });

  it('throws if there are no text matches', () => {
    const root = mount(<div />);
    expect(() => root.getByText('hello')).toThrow(
      'Unable to find any elements with the text: hello',
    );
  });
});

describe('getAllByText', () => {
  it('finds all text nodes', () => {
    const root = mount(
      <div>
        <div>hello</div>
        <div>hello</div>
      </div>,
    );
    expect(root.getAllByText('hello')).toHaveLength(2);
    expect(root.getAllByText(/hello/)).toHaveLength(2);
  });

  it('finds all deeply nested text nodes', () => {
    const root = mount(
      <div>
        first
        <div>
          test
          <div>
            another<div>hello</div>
            <div>hello</div>
          </div>
        </div>
      </div>,
    );
    expect(root.getAllByText('hello')).toHaveLength(2);
    expect(root.getAllByText(/hello/)).toHaveLength(2);
  });

  it('throws if there are no text matches', () => {
    const root = mount(<div />);
    expect(() => root.getAllByText('hello')).toThrow(
      'Unable to find any elements with the text: hello',
    );
  });
});

describe('getByLabelText', () => {
  it('finds an input by label text', () => {
    const root = mount(
      <div>
        <label htmlFor="input">hello</label>
        <input id="input" />
      </div>,
    );
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds an input by aria-label', () => {
    const root = mount(<input aria-label="hello" />);
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds an input by aria-labelledby', () => {
    const root = mount(
      <div>
        <span id="label">hello</span>
        <input aria-labelledby="label" />
      </div>,
    );
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds an input nested in a label', () => {
    const root = mount(
      <label>
        hello
        <input />
      </label>,
    );
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds an input nested in a label with text in a child', () => {
    const root = mount(
      <label>
        <span>hello</span>
        <input />
      </label>,
    );
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds a textarea by aria-label', () => {
    const root = mount(<textarea aria-label="hello" />);
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds an textarea by aria-labelledby', () => {
    const root = mount(
      <div>
        <label id="label">hello</label>
        <textarea aria-labelledby="label" />
      </div>,
    );
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds a textarea by label text', () => {
    const root = mount(
      <div>
        <label htmlFor="textarea">hello</label>
        <textarea id="textarea" />
      </div>,
    );
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('finds a textarea nested in a label', () => {
    const root = mount(
      <label>
        hello
        <textarea />
      </label>,
    );
    expect(root.getByLabelText('hello')).toBeInDocument();
  });

  it('throws if there are multiple input matches', () => {
    const root = mount(
      <div>
        <label htmlFor="input">hello</label>
        <input id="input" />
        <label htmlFor="another-input">hello</label>
        <input id="another-input" />
      </div>,
    );
    expect(() => root.getByLabelText('hello')).toThrow(
      'found more than one match for hello. Did you mean to call `getAllByLabelText`?',
    );
  });
});
