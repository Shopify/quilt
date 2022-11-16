import {
  shallowArrayComparison,
  isChangeEvent,
  getValues,
  getDirtyValues,
  noop,
  validateAll,
  fieldsToArray,
  reduceFields,
} from '../utilities';
import type {Field} from '../types';

function mockField<T>(params: Partial<Field<T>> | T): Field<T | undefined> {
  const value = typeof params === 'string' ? params : undefined;
  const fieldProps = typeof params === 'string' ? {} : params;

  return {
    value,
    error: undefined,
    defaultValue: undefined,
    touched: false,
    dirty: false,
    onBlur: noop,
    onChange: noop,
    runValidation: () => '',
    setError: noop,
    newDefaultValue: noop,
    reset: noop,
    ...fieldProps,
  };
}

describe('shallowArrayComparison()', () => {
  describe('when the two arrays are the same', () => {
    it('returns true', () => {
      const array1 = [1, 'a', 2, 'b'];
      const array2 = [1, 'a', 2, 'b'];

      expect(shallowArrayComparison(array1, array2)).toBe(true);
    });
  });

  describe('when the two arrays are not the same', () => {
    it('returns true', () => {
      const array1 = [1, 'a', 2, 'b'];
      const array2 = ['other', 'stuff', 'in', 'here'];

      expect(shallowArrayComparison(array1, array2)).toBe(false);
    });
  });
});

describe('isChangeEvent()', () => {
  it('returns false on null', () => {
    expect(isChangeEvent(null)).toBe(false);
  });
});

describe('getValues()', () => {
  it('returns form value', () => {
    const formValue = {
      username: 'myUsername',
      name: {
        firstName: 'myFirstName',
      },
      emails: [
        {
          work: 'work@example.com',
        },
      ],
    };
    const fieldBag = {
      username: mockField(formValue.username),
      name: {
        firstName: mockField(formValue.name.firstName),
      },
      emails: [
        {
          work: mockField(formValue.emails[0].work),
        },
      ],
    };

    expect(getValues(fieldBag)).toStrictEqual(formValue);
  });

  it('returns empty arrays', () => {
    const formValue = {
      emails: [],
    };
    const fieldBag = {
      emails: [],
    };

    expect(getValues(fieldBag)).toStrictEqual(formValue);
  });
});

describe('getDirtyValues()', () => {
  const formValue = {
    username: 'myUsername',
    occupation: 'software developer',
    name: {
      firstName: 'myFirstName',
      lastName: 'myLastName',
      nickName: {
        preferred: 'nick name pref',
        optional: 'nick name optional',
      },
    },
    emails: [
      {
        work: 'work@example.com',
        work2: 'work2@example.com',
      },
      {
        personal: 'personal@example.com',
      },
      {
        hobby: 'hobby@example.com',
      },
    ],
  };

  it('returns dirty form values', () => {
    const fieldBag = {
      username: {...mockField(formValue.username), dirty: true},
      name: {
        firstName: mockField(formValue.name.firstName),
      },
      emails: [
        {
          work: mockField(formValue.emails[0].work),
        },
      ],
    };

    expect(getDirtyValues(fieldBag)).toStrictEqual({
      username: formValue.username,
    });
  });

  // has potential to return deeply nested dirty fields, but FieldBag type only supports two levels
  it('returns nested dirty form values up to two nested fields', () => {
    const fieldBag = {
      username: mockField(formValue.username),
      occupation: {...mockField(formValue.occupation), dirty: true},
      name: {
        firstName: {...mockField(formValue.name.firstName), dirty: true},
        lastName: mockField(formValue.name.lastName),
      },
      emails: [
        {
          personal: {...mockField(formValue.emails[1].personal), dirty: true},
        },
      ],
    };

    expect(getDirtyValues(fieldBag)).toStrictEqual({
      occupation: formValue.occupation,
      name: {
        firstName: formValue.name.firstName,
      },
      emails: [
        {
          personal: formValue.emails[1].personal,
        },
      ],
    });
  });
});

describe('validateAll', () => {
  it('returns array of field errors', () => {
    function identity<T>(value: T) {
      return () => value;
    }
    const fieldWithError = (message: string) =>
      mockField({runValidation: identity(message)});

    const fieldBag = {
      username: fieldWithError('Invalid username'),
      name: {
        firstName: fieldWithError('Invalid first name'),
      },
      emails: [
        {
          work: fieldWithError('Invalid work email'),
        },
      ],
    };

    const errors = validateAll(fieldBag);
    expect(errors).toContainEqual({message: 'Invalid username'});
    expect(errors).toContainEqual({message: 'Invalid first name'});
    expect(errors).toContainEqual({message: 'Invalid work email'});
  });
});

describe('fieldsToArray()', () => {
  it('returns flat list of fields', () => {
    const username = mockField('');
    const firstName = mockField('');
    const work = mockField('');
    const fieldBag = {
      username,
      name: {firstName},
      emails: [{work}],
    };

    const fieldsArray = fieldsToArray(fieldBag);
    expect(fieldsArray).toContain(username);
    expect(fieldsArray).toContain(firstName);
    expect(fieldsArray).toContain(work);
  });
});

describe('reduceFields()', () => {
  it('visits all fields', () => {
    const username = mockField('');
    const firstName = mockField('');
    const work = mockField('');
    const fieldBag = {
      username,
      name: {firstName},
      emails: [{work}],
    };

    const fieldsArray = reduceFields<Field<any>[]>(
      fieldBag,
      (list, field) => list.concat(field),
      [],
    );
    expect(fieldsArray).toContain(username);
    expect(fieldsArray).toContain(firstName);
    expect(fieldsArray).toContain(work);
  });
});
