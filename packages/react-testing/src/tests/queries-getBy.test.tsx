/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import type {ReactNode} from 'react';

import {mount} from '../mount';
import {
  getAllByText,
  getByText,
  getAllByLabelText,
  getByLabelText,
} from '../queries/getBy';

describe('getAllByText()', () => {
  it('throws an error if there are no elements that match', () => {
    mount(<div />);

    expect(() => getAllByText('Hello, world!')).toThrow(
      'No match found for "Hello, world!". Are you sure that it\'s rendered?',
    );
  });

  it('returns all elements that match', () => {
    const text = 'Hello, World!';
    const regex = /hello, world!/i;

    function Example({children}: {children: ReactNode}) {
      return <p>{children}</p>;
    }

    mount(
      <>
        <div>{text}</div>
        <p>{text}</p>
        <span>{text}</span>
        <label>{text}</label>
        <b>{text}</b>
        <a href="#">{text}</a>
        <Example>{text}</Example>
        <button type="button">{text}</button>
        <input type="submit" value={text} />
      </>,
    );

    expect(getAllByText(text)).toHaveLength(9);
    expect(getAllByText(regex)).toHaveLength(9);
  });
});

describe('getByText()', () => {
  it('throws as error if there are no elements that match', () => {
    mount(<div />);

    expect(() => getByText('Hello, world!')).toThrow(
      'No match found for "Hello, world!". Are you sure that it\'s rendered?',
    );
  });

  it('throws an error if more than one element matches', () => {
    const text = 'Hello, World!';
    const regex = /hello, world!/i;

    mount(
      <>
        <p>{text}</p>
        <p>{text}</p>
      </>,
    );

    expect(() => getByText(text)).toThrow(
      'Found more than one match for "Hello, World!". Did you mean to use `getAllByText`?',
    );
    expect(() => getByText(regex)).toThrow(
      'Found more than one match for /hello, world!/i. Did you mean to use `getAllByText`?',
    );
  });

  it('returns the element that matches', () => {
    const text = 'Hello, World!';

    mount(<p>{text}</p>);

    expect(getByText(text)).toBeInDocument();
    expect(getByText(/hello, world!/i)).toBeInDocument();
  });
});

describe('getAllByLabelText()', () => {
  it('throws an error if there are no elements that match the label text', () => {
    mount(<div />);

    expect(() => getAllByLabelText('hello, world!')).toThrow(
      'No match found for "hello, world!". Are you sure that it\'s rendered?',
    );
    expect(() => getAllByLabelText(/hello, world!/i)).toThrow(
      "No match found for /hello, world!/i. Are you sure that it's rendered?",
    );
  });

  it('returns all elements that match the label text', () => {
    const label = 'Example label';
    const labelRegExp = /example label/i;

    mount(
      <>
        <input aria-label={label} id="1" />

        <label id="example-input-label">{label}</label>
        <input aria-labelledby="example-input-label" id="2" />

        <label>
          {label}
          <input id="3" />
        </label>

        <label>
          <span>{label}</span>
          <input id="4" />
        </label>

        <label htmlFor="example-input">{label}</label>
        <input id="example-input 5" />

        <button type="button" aria-label={label} id="6" />

        <p id="example-button-label">{label}</p>
        <button type="button" aria-labelledby="example-button-label" id="7" />
      </>,
    );

    expect(getAllByLabelText(label)).toHaveLength(7);
    expect(getAllByLabelText(labelRegExp)).toHaveLength(7);
  });
});

describe('getByLabelText()', () => {
  it('throws an error if there are no elements that match the label text', () => {
    mount(<div />);

    expect(() => getByLabelText('Hello, World!')).toThrow(
      'No match found for "Hello, World!". Are you sure that it\'s rendered?',
    );
    expect(() => getByLabelText(/hello, world!/i)).toThrow(
      "No match found for /hello, world!/i. Are you sure that it's rendered?",
    );
  });

  it('throws an error if there is more than one element that matches the label text', () => {
    mount(<div />);

    expect(() => getByLabelText('Hello, World!')).toThrow(
      'No match found for "Hello, World!". Are you sure that it\'s rendered?',
    );
    expect(() => getByLabelText(/hello, world!/i)).toThrow(
      "No match found for /hello, world!/i. Are you sure that it's rendered?",
    );
  });

  it.todo('return the element that match the label text');
});
