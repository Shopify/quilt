/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/button-has-type */
import React from 'react';

import {mount} from '../mount';
import user from '../user';
import {getByLabelText, getByText} from '../queries/getBy';

describe('demo', () => {
  it('fills out a form and submits', () => {
    const onSubmit = jest.fn();
    mount(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const data = Object.fromEntries(formData);
          onSubmit(data);
        }}
      >
        <label>
          Email:
          <input name="email" />
        </label>
        <label>
          Name:
          <input name="firstName" />
        </label>
        <label>
          Eye color:
          <select name="eyeColor">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
        </label>
        <label>
          Bio:
          <textarea name="bio" />
        </label>
        <button>submit</button>
      </form>,
    );

    // user.inputs('testing@shopify.com').into(root.getByLabelText('Email'));
    user.inputs(getByLabelText('Email:'), 'testing@shopify.com');
    user.inputs(getByLabelText('Name:'), 'Matt');
    user.selects(getByLabelText('Eye color:'), getByText('Green'));
    user.inputs(getByLabelText('Bio:'), 'I am a developer');
    user.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'testing@shopify.com',
      firstName: 'Matt',
      bio: 'I am a developer',
      eyeColor: 'green',
    });
  });
});
