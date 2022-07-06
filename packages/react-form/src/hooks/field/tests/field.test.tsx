import React from 'react';
import faker from '@faker-js/faker/locale/en';
import {mount} from '@shopify/react-testing';

import {
  asChoiceField,
  useChoiceField,
  useField,
  FieldConfig,
  asChoiceList,
} from '../field';
import {FieldState} from '../../../types';
import {FieldAction, reduceField, makeFieldReducer} from '../reducer';

describe('useField', () => {
  function TestField({config}: {config: string | FieldConfig<string>}) {
    const field = useField(config);
    const text = 'Test field';

    return (
      <>
        <label htmlFor="test-field">
          {text}
          <input
            id="test-field"
            name="test-field"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        </label>
        {field.error && <p>{field.error}</p>}
      </>
    );
  }

  it('initializes with the given value when only given a value', () => {
    const value = faker.commerce.product();

    const wrapper = mount(<TestField config={value} />);

    expect(wrapper).toContainReactComponent('input', {
      value,
    });
  });

  it('initializes the field to the given value property', () => {
    const value = faker.commerce.product();

    const wrapper = mount(
      <TestField config={{value, validates: alwaysPass}} />,
    );

    expect(wrapper).toContainReactComponent('input', {
      value,
    });
  });

  it('uses the dirty state comparator from the config', () => {
    const dirtyStateComparator = jest.fn();

    const wrapper = mount(
      <TestField
        config={{
          value: 'default value',
          validates: alwaysPass,
          dirtyStateComparator,
        }}
      />,
    );

    wrapper.find('input')!.trigger('onChange', changeEvent('new value'));

    expect(dirtyStateComparator).toHaveBeenCalledWith(
      'default value',
      'new value',
    );
  });

  describe('handlers', () => {
    describe('#onChange', () => {
      it('updates the value of the field when called with only a value', () => {
        const wrapper = mount(<TestField config="old title" />);
        const newValue = faker.commerce.product();

        // we cast here because native input elements don't actually send naked values up like this
        wrapper.find('input')!.trigger('onChange', newValue as any);

        expect(wrapper).toContainReactComponent('input', {
          value: newValue,
        });
      });

      it('updates the value of the field when called with an event', () => {
        const wrapper = mount(<TestField config="old title" />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));

        expect(wrapper).toContainReactComponent('input', {
          value: newValue,
        });
      });

      it('runs validation if the field already has an error', () => {
        const fieldConfig = {
          value: 'old title',
          validates: (value: string) =>
            value.length < 10 ? 'not long enough' : undefined,
        };
        const wrapper = mount(<TestField config={fieldConfig} />);

        wrapper.find('input')!.trigger('onChange', changeEvent('not long'));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        expect(wrapper).toContainReactComponent('p', {
          children: 'not long enough',
        });

        wrapper
          .find('input')!
          .trigger(
            'onChange',
            changeEvent('so very long it is crazy how long this is'),
          );

        expect(wrapper).not.toContainReactComponent('p');
      });
    });

    describe('#onBlur', () => {
      it('does not run validation if the field was not interacted with', () => {
        const fieldConfig = {
          value: 'old title',
          validates: (value: string) => `${value} is horrid`,
        };
        const wrapper = mount(<TestField config={fieldConfig} />);

        wrapper.find('input')!.trigger('onBlur', blurEvent());

        expect(wrapper).not.toContainReactComponent('p');
      });

      it('runs validation with the latest value if the field was changed', () => {
        const fieldConfig = {
          value: 'old title',
          validates: (value: string) => `${value} is horrid`,
        };
        const wrapper = mount(<TestField config={fieldConfig} />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        expect(wrapper).toContainReactComponent('p', {
          children: fieldConfig.validates(newValue),
        });
      });

      it("runs validation if the field was changed and then changed back to it's initial value", () => {
        const originalValue = faker.commerce.product();
        const fieldConfig = {
          value: originalValue,
          validates: (value: string) => `${value} is horrid`,
        };
        const wrapper = mount(<TestField config={fieldConfig} />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onChange', changeEvent(originalValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        expect(wrapper).toContainReactComponent('p', {
          children: fieldConfig.validates(originalValue),
        });
      });

      it('uses the error message from the first failing validator if there are multiple', () => {
        const firstFailingValidator = (value: string) =>
          `${value} tastes most foul`;
        const fieldConfig = {
          value: 'old title',
          validates: [
            alwaysPass,
            firstFailingValidator,
            alwaysPass,
            (value: string) => `${value} is horrid`,
          ],
        };
        const wrapper = mount(<TestField config={fieldConfig} />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        expect(wrapper).toContainReactComponent('p', {
          children: firstFailingValidator(newValue),
        });
      });

      it('updates the allErrors property with all failing validation messages', () => {
        function TestField({config}: {config: string | FieldConfig<string>}) {
          const field = useField(config);
          const text = 'Test field';

          return (
            <>
              <label htmlFor="test-field">
                {text}
                <input
                  id="test-field"
                  name="test-field"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </label>
              {field.allErrors && <p>{field.allErrors}</p>}
            </>
          );
        }

        const firstFailingValidator = (value: string) =>
          `${value} tastes most foul`;
        const secondFailingValidator = (value: string) => `${value} is horrid`;

        const fieldConfig = {
          value: 'old title',
          validates: [
            alwaysPass,
            firstFailingValidator,
            alwaysPass,
            secondFailingValidator,
          ],
        };
        const wrapper = mount(<TestField config={fieldConfig} />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        expect(wrapper).toContainReactComponent('p', {
          children: [
            firstFailingValidator(newValue),
            secondFailingValidator(newValue),
          ],
        });
      });

      it('only updates the allErrors property if validation errors have changed', () => {
        function TestField({config}: {config: string | FieldConfig<string>}) {
          const field = useField(config);
          const text = 'Test field';

          return (
            <>
              <label htmlFor="test-field">
                {text}
                <input
                  id="test-field"
                  name="test-field"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </label>
              {field.allErrors && <p>{field.allErrors}</p>}
            </>
          );
        }

        const failingValidator = (value: string) => `${value} tastes most foul`;

        const fieldConfig = {
          value: 'old title',
          validates: [failingValidator],
        };

        const wrapper = mount(<TestField config={fieldConfig} />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        const allErrorsFirstValidation = wrapper.find('p')!.props.children;

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        const allErrorsSecondValidation = wrapper.find('p')!.props.children;

        expect(allErrorsFirstValidation).toStrictEqual(
          allErrorsSecondValidation,
        );
      });

      it('does not update allErrors if there are no failing validations', () => {
        function TestField({config}: {config: string | FieldConfig<string>}) {
          const field = useField(config);
          const text = 'Test field';

          return (
            <>
              <label htmlFor="test-field">
                {text}
                <input
                  id="test-field"
                  name="test-field"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </label>
              {field.allErrors && <p>{field.allErrors}</p>}
            </>
          );
        }

        const fieldConfig = {
          value: 'old title',
          validates: [alwaysPass],
        };

        const wrapper = mount(<TestField config={fieldConfig} />);
        const newValue = faker.commerce.product();

        expect(wrapper.find('p')!.props.children).toStrictEqual([]);

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        const allErrorsFirstValidation = wrapper.find('p')!.props.children;

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());

        const allErrorsSecondValidation = wrapper.find('p')!.props.children;

        expect(allErrorsFirstValidation).toBe(allErrorsSecondValidation);
      });
    });
  });

  describe('automatic reinitializiation', () => {
    it('does not reinitialize the field when rerendered with the same value', () => {
      const wrapper = mount(<TestField config="Initial value" />);
      const newValue = faker.commerce.product();

      wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
      wrapper.setProps({config: 'Initial value'});

      expect(wrapper).toContainReactComponent('input', {
        value: newValue,
      });
    });

    it('does reinitialize the field when rerendered with a new value', () => {
      const wrapper = mount(<TestField config="Initial value" />);
      const secondValue = faker.commerce.product();

      wrapper.find('input')!.trigger('onChange', changeEvent(secondValue));
      const finalValue = faker.commerce.product();
      wrapper.setProps({config: finalValue});

      expect(wrapper).toContainReactComponent('input', {
        value: finalValue,
      });
    });

    it('does not reinitialize the field when rerendered with a deeply equal value', () => {
      function FooBarTestField({
        config,
      }: {
        config: {foo: string} | FieldConfig<{foo: string}>;
      }) {
        const field = useField(config);
        const text = 'Test field';

        return (
          <>
            <label htmlFor="test-field">
              {text}
              <input
                id="test-field"
                name="test-field"
                value={field.value.foo}
                onChange={({target}) => field.onChange({foo: target.value})}
                onBlur={field.onBlur}
              />
            </label>
            {field.error && <p>{field.error}</p>}
          </>
        );
      }

      const wrapper = mount(<FooBarTestField config={{foo: 'bar'}} />);
      const newValue = faker.commerce.product();

      wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
      wrapper.setProps({config: {foo: 'bar'}});

      expect(wrapper).toContainReactComponent('input', {
        value: newValue,
      });
    });
  });

  describe('validation dependencies', () => {
    function DependenciesField({
      config,
      dependencies,
    }: {
      config: string | FieldConfig<any>;
      dependencies: unknown[];
    }) {
      const field = useField(config, dependencies);
      const text = 'Test field';

      return (
        <>
          <label htmlFor="test-field">
            {text}
            <input
              id="test-field"
              name="test-field"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          </label>
          {field.error && <p>{field.error}</p>}
        </>
      );
    }

    it('validators use latest version of dependencies', () => {
      let someOtherFieldValue = 'cool';

      const fieldConfig = {
        value: '',
        validates: (value) => {
          if (someOtherFieldValue === 'radical' && value === 'pants') {
            return 'no radical pants allowed';
          }
        },
      };

      const wrapper = mount(
        <DependenciesField
          config={fieldConfig}
          dependencies={[someOtherFieldValue]}
        />,
      );

      someOtherFieldValue = 'radical';
      wrapper.find('input')!.trigger('onChange', changeEvent('pants'));
      wrapper.find('input')!.trigger('onBlur', blurEvent());

      expect(wrapper).toContainReactComponent('p', {
        children: fieldConfig.validates('pants'),
      });
    });
  });

  describe('#reduceField', () => {
    function buildState<Value>({
      value,
      defaultValue,
      dirty = false,
    }): FieldState<Value> {
      return {
        value,
        defaultValue,
        error: undefined,
        touched: true,
        dirty,
      };
    }

    describe('when the new value is the same as the default value', () => {
      describe('when the default value is an array', () => {
        it('identifies that the state is not dirty', () => {
          const originalState = buildState({value: [], defaultValue: []});
          const action: FieldAction<string[]> = {
            type: 'update',
            payload: [],
          };

          const newState = reduceField(originalState, action);

          expect(originalState).toStrictEqual(newState);
        });

        it('identifies that the state is dirty', () => {
          const originalState = buildState({value: [], defaultValue: []});
          const action: FieldAction<string[]> = {
            type: 'update',
            payload: ['new value'],
          };
          const expectedNewState = buildState({
            value: action.payload,
            defaultValue: [],
            dirty: true,
          });

          const newState = reduceField(originalState, action);

          expect(newState).toStrictEqual(expectedNewState);
        });
      });

      describe('when the default value is not an array', () => {
        it('identifies that the state is not dirty', () => {
          const originalState = buildState({value: '', defaultValue: ''});
          const action: FieldAction<string> = {
            type: 'update',
            payload: '',
          };

          const newState = reduceField(originalState, action);

          expect(originalState).toStrictEqual(newState);
        });

        it('identifies that the state is dirty', () => {
          const originalState = buildState({value: '', defaultValue: ''});
          const action: FieldAction<string> = {
            type: 'update',
            payload: 'new value',
          };
          const expectedNewState = buildState({
            value: action.payload,
            defaultValue: '',
            dirty: true,
          });

          const newState = reduceField(originalState, action);

          expect(newState).toStrictEqual(expectedNewState);
        });
      });
    });

    describe('when using a custom comparator', () => {
      it("marks as dirty if the comparator says it's dirty", () => {
        const dirtyStateComparator = () => true;
        const reducer = makeFieldReducer({dirtyStateComparator});
        const originalState = buildState({
          value: 'original value',
          defaultValue: 'default value',
        });
        const action: FieldAction<string> = {
          type: 'update',
          payload: 'updated value',
        };
        const expectedNewState = buildState({
          value: 'updated value',
          defaultValue: 'default value',
          dirty: true,
        });

        const newState = reducer(originalState, action);

        expect(newState).toStrictEqual(expectedNewState);
      });

      it("marks as clean if the comparator says it's not dirty", () => {
        const dirtyStateComparator = () => false;
        const reducer = makeFieldReducer({dirtyStateComparator});
        const originalState = buildState({
          value: 'original value',
          defaultValue: 'default value',
        });
        const action: FieldAction<string> = {
          type: 'update',
          payload: 'updated value',
        };
        const expectedNewState = buildState({
          value: 'updated value',
          defaultValue: 'default value',
          dirty: false,
        });

        const newState = reducer(originalState, action);

        expect(newState).toStrictEqual(expectedNewState);
      });
    });
  });

  describe('imperative methods', () => {
    describe('#runValidation', () => {
      function FieldWithValidationButton({
        config,
      }: {
        config: string | FieldConfig<any>;
      }) {
        const field = useField(config);
        const text = 'Test field';
        return (
          <>
            <label htmlFor="test-field">
              {text}
              <input
                id="test-field"
                name="test-field"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </label>
            {field.error && <p>{field.error}</p>}

            <button type="button" onClick={() => field.runValidation()}>
              Validate field
            </button>
          </>
        );
      }

      it('runs validation', () => {
        const originalValue = faker.commerce.product();
        const fieldConfig = {
          value: originalValue,
          validates: (value: string) => `${value} is horrid`,
        };
        const wrapper = mount(
          <FieldWithValidationButton config={fieldConfig} />,
        );

        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent('p', {
          children: fieldConfig.validates(originalValue),
        });
      });
    });

    describe('#newDefaultValue', () => {
      function FieldWithNewDefaultButton({
        config,
      }: {
        config: string | FieldConfig<any>;
      }) {
        const field = useField(config);
        const text = 'Text field';

        return (
          <>
            <label htmlFor="test-field">
              {text}
              <input
                id="test-field"
                name="test-field"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </label>
            {field.error && <p>{field.error}</p>}

            <button type="button" onClick={() => field.newDefaultValue('test')}>
              Set default
            </button>
          </>
        );
      }

      it('resets the field to a new default value', () => {
        const originalValue = faker.commerce.product();
        const wrapper = mount(
          <FieldWithNewDefaultButton config={originalValue} />,
        );
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent('input', {
          value: 'test',
        });
      });

      it("clears the field's errors", () => {
        const fieldConfig = {
          value: 'old title',
          validates: (value: string) => `${value} is horrid`,
        };
        const wrapper = mount(
          <FieldWithNewDefaultButton config={fieldConfig} />,
        );
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent('p');
      });
    });

    describe('#reset', () => {
      function FieldWithResetButton({
        config,
      }: {
        config: string | FieldConfig<any>;
      }) {
        const field = useField(config);
        const text = 'Text field';

        return (
          <>
            <label htmlFor="test-field">
              {text}
              <input
                id="test-field"
                name="test-field"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </label>
            {field.error && <p>{field.error}</p>}

            <button type="button" onClick={() => field.reset()}>
              Reset field
            </button>
          </>
        );
      }

      it("resets the field to it's initial value", () => {
        const originalValue = faker.commerce.product();
        const fieldConfig = {
          value: originalValue,
          validates: (value: string) => `${value} is horrid`,
        };
        const wrapper = mount(<FieldWithResetButton config={fieldConfig} />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent('input', {
          value: originalValue,
        });
      });

      it("clears the field's errors", () => {
        const fieldConfig = {
          value: 'old title',
          validates: (value: string) => `${value} is horrid`,
        };
        const wrapper = mount(<FieldWithResetButton config={fieldConfig} />);
        const newValue = faker.commerce.product();

        wrapper.find('input')!.trigger('onChange', changeEvent(newValue));
        wrapper.find('input')!.trigger('onBlur', blurEvent());
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent('p');
      });
    });
  });
});

describe('asChoiceField', () => {
  it('replaces value with checked', () => {
    expect(asChoiceField({value: true} as any)).toMatchObject({checked: true});
  });

  it('replaces value with unchecked', () => {
    expect(asChoiceField({value: false} as any)).toMatchObject({
      checked: false,
    });
  });

  it('projects a checked value from a predicate', () => {
    expect(asChoiceField<'A' | 'B'>({value: 'A'} as any, 'A')).toMatchObject({
      checked: true,
    });
  });

  it('projects an unchecked value from a predicate', () => {
    expect(asChoiceField<'A' | 'B'>({value: 'B'} as any, 'A')).toMatchObject({
      checked: false,
    });
  });

  it('calls onChange on the underlying multi-choice field when checked', () => {
    const onChange = jest.fn();
    const checkedValue = 'A';
    const choiceField = asChoiceField(
      {value: 'B', onChange} as any,
      checkedValue,
    );

    choiceField.onChange(true);

    expect(onChange).toHaveBeenCalledWith(checkedValue);
  });

  it('does not call onChange on the underlying multi-choice field when unchecked', () => {
    const onChange = jest.fn();
    const checkedValue = 'A';
    const choiceField = asChoiceField(
      {value: checkedValue, onChange} as any,
      checkedValue,
    );

    choiceField.onChange(false);

    expect(onChange).not.toHaveBeenCalledWith();
  });

  it('calls onChange on the underlying choice field when checked', () => {
    const onChange = jest.fn();
    const choiceField = asChoiceField({value: false, onChange} as any);

    choiceField.onChange(true);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange on the underlying choice field when unchecked', () => {
    const onChange = jest.fn();
    const choiceField = asChoiceField({value: true, onChange} as any);

    choiceField.onChange(false);

    expect(onChange).toHaveBeenCalledWith(false);
  });
});

describe('asChoiceList', () => {
  it('replaces value with selected array', () => {
    expect(asChoiceList({value: 'red'} as any)).toMatchObject({
      selected: ['red'],
    });
  });

  it('replaces undefined with empty selected array', () => {
    expect(
      asChoiceList<string | undefined>({value: undefined} as any),
    ).toMatchObject({
      selected: [],
    });
  });

  it('replaces null with empty selected array', () => {
    expect(
      asChoiceList<string | null>({value: null} as any),
    ).toMatchObject({
      selected: [],
    });
  });

  it('handles the <ChoiceList /> onChange which passes an array', () => {
    const onChange = jest.fn();
    const checkedValue = 'A';
    const choiceField = asChoiceList({value: 'B', onChange} as any);

    choiceField.onChange([checkedValue]);

    expect(onChange).toHaveBeenCalledWith(checkedValue);
  });
});

describe('useChoiceField', () => {
  it('returns a field that has been converted using asChoiceField', () => {
    function Placeholder(_props: any) {
      return null;
    }

    function TestField() {
      const field = useChoiceField(true);

      return <Placeholder field={field} />;
    }

    const wrapper = mount(<TestField />);

    expect(wrapper.find(Placeholder)!.prop('field')).toMatchObject({
      checked: true,
      defaultValue: true,
      dirty: false,
      error: undefined,
      newDefaultValue: expect.any(Function),
      onBlur: expect.any(Function),
      onChange: expect.any(Function),
      reset: expect.any(Function),
      runValidation: expect.any(Function),
      setError: expect.any(Function),
      touched: false,
    });
  });
});

function alwaysPass() {
  return undefined;
}

function changeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return {target: {value}} as any;
}

function blurEvent() {
  // we don't actually use these at all so it is ok to just return an empty object
  return {} as any;
}

function clickEvent() {
  // we don't actually use these at all so it is ok to just return an empty object
  return {} as any;
}
