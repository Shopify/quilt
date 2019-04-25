import React from 'react';
import {mount} from '@shopify/react-testing';
import faker from 'faker';
import {useField, FieldConfig} from '../field';

describe('useField', () => {
  function TestField({config}: {config: string | FieldConfig<any>}) {
    const field = useField(config);

    return (
      <>
        <label htmlFor="test-field">
          Test field{' '}
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
      return (
        <>
          <label htmlFor="test-field">
            Test field{' '}
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
        validates: value => {
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

  describe('imperative methods', () => {
    describe('#runValidation', () => {
      function FieldWithValidationButton({
        config,
      }: {
        config: string | FieldConfig<any>;
      }) {
        const field = useField(config);

        return (
          <>
            <label htmlFor="test-field">
              Test field{' '}
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

        return (
          <>
            <label htmlFor="test-field">
              Test field{' '}
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

        return (
          <>
            <label htmlFor="test-field">
              Test field{' '}
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
