/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import type {ReactNode} from 'react';

import {mount} from '../mount';
import {
  queryAllByText,
  queryByText,
  queryAllByLabelText,
  queryByLabelText,
} from '../queries/queryBy';

describe('queryAllByText()', () => {
  it('returns an empty array if no elements match', () => {
    mount(<div />);

    expect(queryAllByText('Hello, World!')).toHaveLength(0);
    expect(queryAllByText(/hello, world!/i)).toHaveLength(0);
  });

  it('returns all elements that match the text', () => {
    const text = 'Hello, World!';

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

    expect(queryAllByText(text)).toHaveLength(9);
    expect(queryAllByText(/hello, world!/i)).toHaveLength(9);
  });
});

describe('queryByText()', () => {
  it('returns null if no elements match', () => {
    mount(<div />);

    expect(queryByText('Hello, World!')).toBeNull();
    expect(queryByText(/hello, world!/i)).toBeNull();
  });

  it('returns the element that matches if there is only one', () => {
    const text = 'Hello, World!';
    mount(
      <>
        <p>{text}</p>
      </>,
    );

    expect(queryByText(text)).toBeInDocument();
    expect(queryByText(/hello, world!/i)).toBeInDocument();
  });

  it('throws an error if more than one element matches the text', () => {
    const text = 'Hello, World!';
    mount(
      <>
        <p>{text}</p>
        <p>{text}</p>
      </>,
    );

    expect(() => queryByText(text)).toThrow(
      'Found more than one match for "Hello, World!". Did you mean to use `queryAllByText`?',
    );
    expect(() => queryByText(/hello, world!/i)).toThrow(
      'Found more than one match for /hello, world!/i. Did you mean to use `queryAllByText`?',
    );
  });
});

describe('queryAllByLabelText', () => {
  const label = 'Example label';
  const labelRegExp = /example label/i;

  it('returns an empty array if there are no matches', () => {
    mount(<div />);

    expect(queryAllByLabelText(label)).toHaveLength(0);
    expect(queryAllByLabelText(labelRegExp)).toHaveLength(0);
  });

  it('returns all elements that match the label', () => {
    mount(
      <form>
        <input aria-label={label} id="1" />

        <label id="example-input-label">{label}</label>
        <input aria-labelledby="example-input-label" id="2" name={label} />

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
      </form>,
    );

    expect(queryAllByLabelText(label)).toHaveLength(7);
    expect(queryAllByLabelText(labelRegExp)).toHaveLength(7);
  });
});

describe('queryByLabelText()', () => {
  it('returns null if there are no matches', () => {
    mount(<div />);

    expect(queryByLabelText('example text')).toBeNull();
    expect(queryByLabelText(/example text/i)).toBeNull();
  });

  it('returns the element associated with the label when found', () => {
    const label = 'Example label';
    const labelRegExp = /example label/i;

    mount(<input aria-label={label} />);

    expect(queryByLabelText(label)).toBeInDocument();
    expect(queryByLabelText(labelRegExp)).toBeInDocument();
  });

  it('throws an error if there is more than one match', () => {
    const label = 'Example label';
    const labelRegExp = /example label/i;

    mount(
      <>
        <input aria-label={label} />
        <label>
          {label}
          <input />
        </label>
      </>,
    );

    expect(() => queryByLabelText(label)).toThrow(
      'Found more than one match for "Example label". Did you mean to use `queryAllByLabelText`?',
    );
    expect(() => queryByLabelText(labelRegExp)).toThrow(
      'Found more than one match for /example label/i. Did you mean to use `queryAllByLabelText`?',
    );
  });
});
