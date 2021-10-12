/* eslint-disable react/no-array-index-key */
import React from 'react';
import faker from 'faker';
import {mount} from '@shopify/react-testing';

import {useBaseList, FieldListConfig} from '../baselist';
import {ListValidationContext} from '../../../types';

import {
  Variant,
  randomVariants,
  changeEvent,
  alwaysFail,
  clickEvent,
  TextField,
} from './utils';

describe('useBaseList', () => {
  function TestList(config: FieldListConfig<Variant>) {
    const {fields, dirty, reset} = useBaseList<Variant>(config);

    return (
      <>
        <ul>
          {fields.map((fields, index) => (
            <li key={index}>
              <TextField
                label="price"
                name={`price${index}`}
                {...fields.price}
              />
              <TextField
                label="option"
                name={`option${index}`}
                {...fields.optionName}
              />
              <TextField
                label="value"
                name={`value${index}`}
                {...fields.optionValue}
              />
            </li>
          ))}
        </ul>

        <button type="button" onClick={reset}>
          {dirty}
        </button>
      </>
    );
  }

  it('generates an array of field dictionaries with values from the properties of objects in the given list', () => {
    const variants = randomVariants(4);
    const wrapper = mount(<TestList list={variants} />);

    variants.forEach(({price, optionName, optionValue}) => {
      expect(wrapper).toContainReactComponent(TextField, {
        value: price,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
      expect(wrapper).toContainReactComponent(TextField, {
        value: optionName,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
      expect(wrapper).toContainReactComponent(TextField, {
        value: optionValue,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
    });
  });

  it('accepts a list as argument', () => {
    function ListArgTestList({list}: {list: Variant[]}) {
      const {fields} = useBaseList<Variant>(list);

      return (
        <ul>
          {fields.map((fields, index) => (
            <li key={index}>
              <TextField
                label="price"
                name={`price${index}`}
                {...fields.price}
              />
              <TextField
                label="option"
                name={`option${index}`}
                {...fields.optionName}
              />
              <TextField
                label="value"
                name={`value${index}`}
                {...fields.optionValue}
              />
            </li>
          ))}
        </ul>
      );
    }

    const variants = randomVariants(4);
    const wrapper = mount(<ListArgTestList list={variants} />);

    variants.forEach(({price, optionName, optionValue}) => {
      expect(wrapper).toContainReactComponent(TextField, {
        value: price,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
      expect(wrapper).toContainReactComponent(TextField, {
        value: optionName,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
      expect(wrapper).toContainReactComponent(TextField, {
        value: optionValue,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
    });
  });

  describe('handlers', () => {
    describe('#onChange', () => {
      it('updates the value of the specific field and item when called with a value', () => {
        const variants: Variant[] = [
          {
            price: '1.00',
            optionName: 'material',
            optionValue: faker.commerce.productMaterial(),
          },
          {
            price: '2.00',
            optionName: 'material',
            optionValue: faker.commerce.productMaterial(),
          },
        ];

        const newPrice = faker.commerce.price();
        const wrapper = mount(<TestList list={variants} />);
        wrapper
          .find(TextField, {name: 'price0'})!
          .trigger('onChange', newPrice);

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          value: newPrice,
        });
        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price1',
          value: variants[1].price,
        });
      });

      it('updates the value of the specific field and item when called with an event', () => {
        const variants: Variant[] = [
          {
            price: '1.00',
            optionName: 'material',
            optionValue: faker.commerce.productMaterial(),
          },
          {
            price: '2.00',
            optionName: 'material',
            optionValue: faker.commerce.productMaterial(),
          },
        ];

        const newPrice = faker.commerce.price();
        const wrapper = mount(<TestList list={variants} />);
        wrapper
          .find(TextField, {name: 'price1'})!
          .trigger('onChange', changeEvent(newPrice));

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price1',
          value: newPrice,
        });
        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          value: variants[0].price,
        });
      });

      it('runs validation if the field already has an error', () => {
        const variants: Variant[] = [
          {
            price: '1.00',
            optionName: 'material',
            optionValue: faker.commerce.productMaterial(),
          },
          {
            price: '2.00',
            optionName: 'material',
            optionValue: faker.commerce.productMaterial(),
          },
        ];
        const validation = {
          price: (value: string) => {
            if (value.length < 1) {
              return 'Price must be specified';
            }
          },
        };

        const wrapper = mount(
          <TestList list={variants} validates={validation} />,
        );
        wrapper
          .find(TextField, {name: 'price1'})!
          .trigger('onChange', changeEvent(''));
        wrapper.find(TextField, {name: 'price1'})!.trigger('onBlur');

        const newPrice = faker.commerce.price();
        wrapper
          .find(TextField, {name: 'price1'})!
          .trigger('onChange', changeEvent(newPrice));

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price1',
          error: '',
        });
      });
    });

    describe('#onBlur', () => {
      it('does not run validation on any fields when a field is blurred which has not been interacted with', () => {
        const variants = randomVariants(4);
        const validation = {
          price: alwaysFail,
          optionName: alwaysFail,
          optionValue: alwaysFail,
        };

        const wrapper = mount(
          <TestList list={variants} validates={validation} />,
        );
        wrapper.find(TextField, {name: 'price1'})!.trigger('onBlur');
        wrapper.find(TextField, {name: 'option0'})!.trigger('onBlur');
        wrapper.find(TextField, {name: 'value3'})!.trigger('onBlur');

        variants.forEach(({price, optionName, optionValue}) => {
          expect(wrapper).toContainReactComponent(TextField, {
            value: price,
            error: undefined,
          });
          expect(wrapper).toContainReactComponent(TextField, {
            value: optionName,
            error: undefined,
          });
          expect(wrapper).toContainReactComponent(TextField, {
            value: optionValue,
            error: undefined,
          });
        });
      });

      it('runs validation and updates error of a field when it is interacted with', () => {
        const variants = randomVariants(1);
        const validation = {
          price: alwaysFail,
        };

        const wrapper = mount(
          <TestList list={variants} validates={validation} />,
        );

        const newValue = faker.commerce.price();
        wrapper
          .find(TextField, {name: 'price0'})!
          .trigger('onChange', newValue);
        wrapper.find(TextField, {name: 'price0'})!.trigger('onBlur');

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          value: newValue,
          error: alwaysFail(newValue),
        });
      });

      it('does not run validation for other fields when one is validated', () => {
        const variants = randomVariants(2);
        const validation = {
          price: alwaysFail,
          optionName: alwaysFail,
          optionValue: alwaysFail,
        };

        const wrapper = mount(
          <TestList list={variants} validates={validation} />,
        );

        const newValue = faker.commerce.price();
        wrapper
          .find(TextField, {name: 'price0'})!
          .trigger('onChange', newValue);
        wrapper.find(TextField, {name: 'price0'})!.trigger('onBlur');

        ['option0', 'value0', 'price1', 'option1', 'value1'].forEach((name) => {
          expect(wrapper).toContainReactComponent(TextField, {
            name,
            error: undefined,
          });
        });
      });

      it("runs validation if the field was changed and then changed back to it's initial value", () => {
        const originalPrice = '3.50';
        const variants: Variant[] = [
          {
            price: originalPrice,
            optionName: 'material',
            optionValue: faker.commerce.productMaterial(),
          },
        ];
        const validation = {
          price: alwaysFail,
        };

        const wrapper = mount(
          <TestList list={variants} validates={validation} />,
        );

        wrapper.find(TextField)!.trigger('onChange', faker.commerce.price());
        wrapper.find(TextField)!.trigger('onChange', originalPrice);
        wrapper.find(TextField)!.trigger('onBlur');

        expect(wrapper).toContainReactComponent(TextField, {
          value: originalPrice,
          error: alwaysFail(originalPrice),
        });
      });

      it('uses the error message from the first failing validator if there are multiple', () => {
        const error = faker.lorem.sentence();
        const variants = randomVariants(1);
        const validation = {
          price: [() => error, alwaysFail],
        };

        const wrapper = mount(
          <TestList list={variants} validates={validation} />,
        );

        wrapper.find(TextField)!.trigger('onChange', '3.50');
        wrapper.find(TextField)!.trigger('onBlur');

        expect(wrapper).toContainReactComponent(TextField, {
          error,
        });
      });

      it('passes siblings and the current list item to validators as part of the validation context', () => {
        const variants = randomVariants(2);

        const validation = {
          optionValue: (
            value: string,
            {siblings, listItem}: ListValidationContext<Variant>,
          ) => {
            const {optionName} = listItem;

            const anyDupes = siblings.some(
              (sibling) =>
                sibling.optionName.value === optionName.value &&
                sibling.optionValue.value === value,
            );
            // eslint-disable-next-line jest/no-if
            if (anyDupes) {
              return 'No duplicates allowed';
            }
          },
        };

        const wrapper = mount(
          <TestList list={variants} validates={validation} />,
        );

        wrapper
          .find(TextField, {name: 'value0'})!
          .trigger('onChange', variants[1].optionValue);
        wrapper.find(TextField, {name: 'value0'})!.trigger('onBlur');

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'value0',
          error: 'No duplicates allowed',
        });
      });
    });
  });

  describe('automatic reinitializiation', () => {
    it('does not reinitialize when rerendered with the same list', () => {
      const originalPrice = '3.50';
      const variants: Variant[] = [
        {
          price: originalPrice,
          optionName: 'material',
          optionValue: faker.commerce.productMaterial(),
        },
      ];
      const wrapper = mount(<TestList list={variants} />);
      const newPrice = faker.commerce.price();

      wrapper
        .find(TextField, {name: 'price0'})!
        .trigger('onChange', changeEvent(newPrice));
      wrapper.setProps({list: variants});

      expect(wrapper).toContainReactComponent(TextField, {
        name: 'price0',
        value: newPrice,
      });
    });

    it('does reinitialize when rerendered with a different list', () => {
      const originalPrice = '3.50';
      const variant: Variant = {
        price: originalPrice,
        optionName: 'material',
        optionValue: faker.commerce.productMaterial(),
      };
      const wrapper = mount(<TestList list={[variant]} />);
      const newPrice = faker.commerce.price(10, 80);

      wrapper
        .find(TextField, {name: 'price0'})!
        .trigger('onChange', changeEvent(newPrice));

      wrapper.setProps({list: [{...variant, price: '100.00'}]});
      expect(wrapper.find(TextField, {name: 'price0'})).not.toHaveReactProps({
        value: newPrice,
      });
    });

    it('does not reinitialize when rerendered with a reference unequal but deeply equal list', () => {
      const variants: Variant[] = [
        {
          price: '3.50',
          optionName: 'material',
          optionValue: faker.commerce.productMaterial(),
        },
      ];
      const wrapper = mount(<TestList list={variants} />);
      const newPrice = faker.commerce.price();

      wrapper
        .find(TextField, {name: 'price0'})!
        .trigger('onChange', changeEvent(newPrice));

      wrapper.setProps({list: [...variants]});

      expect(wrapper.find(TextField, {name: 'price0'})).toHaveReactProps({
        value: newPrice,
      });
    });
  });

  describe('imperative methods', () => {
    describe('#reset', () => {
      function TestListWithPriceReset(config: FieldListConfig<Variant>) {
        const {fields} = useBaseList<Variant>(config);

        return (
          <ul>
            {fields.map((fields, index) => (
              <li key={index}>
                <TextField
                  label="price"
                  name={`price${index}`}
                  {...fields.price}
                />
                <button type="button" onClick={() => fields.price.reset()}>
                  Reset
                </button>
                <TextField
                  label="option"
                  name={`option${index}`}
                  {...fields.optionName}
                />
                <TextField
                  label="value"
                  name={`value${index}`}
                  {...fields.optionValue}
                />
              </li>
            ))}
          </ul>
        );
      }

      it('resets the field that it is called on', () => {
        const variants: Variant[] = randomVariants(2);

        const wrapper = mount(<TestListWithPriceReset list={variants} />);
        wrapper
          .find(TextField, {name: 'price0'})!
          .trigger('onChange', changeEvent('3.50'));
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          value: variants[0].price,
        });
      });

      it('does not reset the same field on other items', () => {
        const variants: Variant[] = randomVariants(2);

        const wrapper = mount(<TestListWithPriceReset list={variants} />);
        wrapper
          .find(TextField, {name: 'price0'})!
          .trigger('onChange', changeEvent('3.50'));
        wrapper
          .find(TextField, {name: 'price1'})!
          .trigger('onChange', changeEvent('3.50'));
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          value: variants[0].price,
        });
        expect(wrapper).not.toContainReactComponent(TextField, {
          name: 'price1',
          value: variants[1].price,
        });
      });

      it('does not reset other fields on the same item', () => {
        const variants: Variant[] = randomVariants(2);

        const wrapper = mount(<TestListWithPriceReset list={variants} />);
        wrapper
          .find(TextField, {name: 'price0'})!
          .trigger('onChange', changeEvent('3.50'));
        wrapper
          .find(TextField, {name: 'option0'})!
          .trigger('onChange', changeEvent('size'));
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          value: variants[0].price,
        });
        expect(wrapper).not.toContainReactComponent(TextField, {
          name: 'option0',
          value: variants[0].optionName,
        });
      });
    });

    describe('#runValidation', () => {
      function TestListWithValidationButton(config: FieldListConfig<Variant>) {
        const {fields} = useBaseList<Variant>(config);

        return (
          <ul>
            {fields.map((fields, index) => (
              <li key={index}>
                <TextField
                  label="price"
                  name={`price${index}`}
                  {...fields.price}
                />
                <button
                  type="button"
                  onClick={() => fields.price.runValidation()}
                >
                  Reset
                </button>
                <TextField
                  label="option"
                  name={`option${index}`}
                  {...fields.optionName}
                />
                <TextField
                  label="value"
                  name={`value${index}`}
                  {...fields.optionValue}
                />
              </li>
            ))}
          </ul>
        );
      }

      it('validates the field it is called on', () => {
        const variants: Variant[] = randomVariants(1);

        const wrapper = mount(
          <TestListWithValidationButton
            list={variants}
            validates={{price: alwaysFail}}
          />,
        );

        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          error: alwaysFail(variants[0].price),
        });
      });

      it('does not validate other fields on the same item', () => {
        const variants: Variant[] = randomVariants(1);

        const wrapper = mount(
          <TestListWithValidationButton
            list={variants}
            validates={{price: alwaysFail}}
          />,
        );

        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent(TextField, {
          name: 'option0',
          error: alwaysFail(variants[0].optionName),
        });
      });

      it('does not validate the same field on other items', () => {
        const variants: Variant[] = randomVariants(2);

        const wrapper = mount(
          <TestListWithValidationButton
            list={variants}
            validates={{price: alwaysFail}}
          />,
        );

        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent(TextField, {
          name: 'price1',
          error: alwaysFail(variants[0].optionName),
        });
      });
    });

    describe('#newDefaultValue', () => {
      function TestListWithDefaultEmptier(config: FieldListConfig<Variant>) {
        const {fields} = useBaseList<Variant>(config);

        return (
          <ul>
            {fields.map((fields, index) => (
              <li key={index}>
                <TextField
                  label="price"
                  name={`price${index}`}
                  {...fields.price}
                />
                <button
                  type="button"
                  onClick={() => fields.price.newDefaultValue('')}
                >
                  Reset
                </button>
                <TextField
                  label="option"
                  name={`option${index}`}
                  {...fields.optionName}
                />
                <TextField
                  label="value"
                  name={`value${index}`}
                  {...fields.optionValue}
                />
              </li>
            ))}
          </ul>
        );
      }

      it('reinitializes the field it is called on', () => {
        const variants: Variant[] = randomVariants(1);

        const wrapper = mount(<TestListWithDefaultEmptier list={variants} />);
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price0',
          value: '',
        });
      });

      it('does not reinitialize other fields on the same item', () => {
        const variants: Variant[] = randomVariants(1);

        const wrapper = mount(<TestListWithDefaultEmptier list={variants} />);
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent(TextField, {
          name: 'option0',
          value: '',
        });
      });

      it('does not reinitialize the same field on other items', () => {
        const variants: Variant[] = randomVariants(2);

        const wrapper = mount(<TestListWithDefaultEmptier list={variants} />);
        wrapper.find('button')!.trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent(TextField, {
          name: 'price1',
          value: '',
        });
      });
    });
  });

  describe('reset and dirty', () => {
    it('can reset base list', () => {
      const price = '1.00';
      const variants: Variant[] = [
        {
          price,
          optionName: 'material',
          optionValue: faker.commerce.productMaterial(),
        },
      ];

      const newPrice = faker.commerce.price();
      const wrapper = mount(<TestList list={variants} />);
      wrapper.find(TextField, {name: 'price0'})!.trigger('onChange', newPrice);

      expect(wrapper).toContainReactComponent(TextField, {
        name: 'price0',
        value: newPrice,
      });

      wrapper.find('button')!.trigger('onClick');

      expect(wrapper).toContainReactComponent(TextField, {
        name: 'price0',
        value: price,
      });
    });

    it('returns the expected dirty state', () => {
      const variants: Variant[] = [
        {
          price: '1.00',
          optionName: 'material',
          optionValue: faker.commerce.productMaterial(),
        },
      ];

      const newPrice = faker.commerce.price();
      const wrapper = mount(<TestList list={variants} />);
      wrapper.find(TextField, {name: 'price0'})!.trigger('onChange', newPrice);

      expect(wrapper).toContainReactComponent('button', {
        children: true,
      });

      wrapper.find('button')!.trigger('onClick');

      expect(wrapper).toContainReactComponent('button', {
        children: false,
      });
    });
  });

  describe('value, newDefaultValue and defaultValue', () => {
    function TestListWithValue(config: FieldListConfig<Variant>) {
      const {value, newDefaultValue, defaultValue} = useBaseList<Variant>(
        config,
      );

      const onNewDefault = (value: Variant[]) => {
        newDefaultValue(value);
      };

      return (
        <>
          {value.map((variant) => (
            <>
              <p>Value: {variant.price}</p>
              <p>Value: {variant.optionName}</p>
              <p>Value: {variant.optionValue}</p>
            </>
          ))}

          {defaultValue.map((variant) => (
            <>
              <p>Default: {variant.price}</p>
              <p>Default: {variant.optionName}</p>
              <p>Default: {variant.optionValue}</p>
            </>
          ))}

          <button type="button" onClick={onNewDefault as any} />
        </>
      );
    }

    it('returns the value of the baselist', () => {
      const price = '1.00';
      const optionName = 'material';
      const optionValue = 'cotton';
      const variants: Variant[] = [
        {
          price,
          optionName,
          optionValue,
        },
      ];

      const wrapper = mount(<TestListWithValue list={variants} />);
      expect(wrapper).toContainReactText(`Value: ${price}`);
      expect(wrapper).toContainReactText(`Value: ${optionName}`);
      expect(wrapper).toContainReactText(`Value: ${optionValue}`);
    });

    it('resets the list to a new default value', () => {
      const price = '1.00';
      const optionName = 'material';
      const optionValue = 'cotton';
      const variants: Variant[] = [
        {
          price,
          optionName,
          optionValue,
        },
      ];
      const newDefaultPrice = '2.00';
      const newDefaultOption = 'color';
      const newDefaultOptionValue = 'blue';

      const wrapper = mount(<TestListWithValue list={variants} />);

      expect(wrapper).toContainReactText(`Default: ${price}`);
      expect(wrapper).toContainReactText(`Default: ${optionName}`);
      expect(wrapper).toContainReactText(`Default: ${optionValue}`);

      wrapper.find('button')!.trigger('onClick', [
        {
          price: newDefaultPrice,
          optionName: newDefaultOption,
          optionValue: newDefaultOptionValue,
        },
      ] as any);

      expect(wrapper).toContainReactText(`Default: ${newDefaultPrice}`);
      expect(wrapper).toContainReactText(`Default: ${newDefaultOption}`);
      expect(wrapper).toContainReactText(`Default: ${newDefaultOptionValue}`);
    });

    it('reinitializes the list when the list config has changed after changing the default value', () => {
      const variants: Variant[] = [
        {
          price: '1.00',
          optionName: 'material',
          optionValue: 'cotton',
        },
      ];

      const newDefaultPrice = '2.00';
      const newDefaultOption = 'color';
      const newDefaultOptionValue = 'blue';

      const nextVariant = {
        price: '1.00',
        optionName: 'material',
        optionValue: 'cotton',
      };

      const wrapper = mount(<TestListWithValue list={variants} />);

      wrapper.find('button')!.trigger('onClick', [
        {
          price: newDefaultPrice,
          optionName: newDefaultOption,
          optionValue: newDefaultOptionValue,
        },
      ] as any);

      expect(wrapper).toContainReactText(
        `Default: ${newDefaultPrice}Default: ${newDefaultOption}Default: ${newDefaultOptionValue}`,
      );

      wrapper.setProps({list: [nextVariant]});

      expect(wrapper).not.toContainReactText(
        `Default: ${newDefaultPrice}Default: ${newDefaultOption}Default: ${newDefaultOptionValue}`,
      );
    });
  });
});
