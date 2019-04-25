import {useMemo, useEffect, ChangeEvent} from 'react';
import {
  ValidationDictionary,
  Validator,
  NormalizedValidationDictionary,
  FieldStates,
  FieldDictionary,
  FieldState,
  ErrorValue,
  ListValidationContext,
} from '../../types';
import {mapObject, normalizeValidation, isChangeEvent} from '../../utilities';
import {
  updateAction,
  updateErrorAction,
  newDefaultAction,
  reinitializeAction,
  resetAction,
  useListReducer,
} from './reducer';

export interface FieldListConfig<Item extends object> {
  list: Item[];
  validates?: Partial<ValidationDictionary<Item, ListValidationContext<Item>>>;
}

/**
 * A custom hook for handling the state and validations of fields for a list of objects.
 *
 * In it's simplest form `useList` can be called with a single parameter with the list to derive default values and structure from.
 *
 * ```typescript
 * const field = useList([{title: '', description: ''}, {title: '', description: ''}]);
 * ```
 *
 * You can also pass a more complex configuration object specifying a validation dictionary.
 *
 * ```tsx
 *const field = useField({
 *  list: [{title: '', description: ''}, {title: '', description: ''}],
 *  validates: {
 *    title:(title) => {
 *      if (title.length > 3) {
 *        return 'Title must be longer than three characters';
 *      }
 *    },
 *   description: (description) => {
 *     if (description === '') {
 *       return 'Description is required!';
 *     }
 *   }
 *  }
 *});
 * ```
 *
 * Generally, you will want to use the list returned from useList by looping over it in your JSX.
 * ```tsx
 *function MyComponent() {
 *  const title = useField([{title: '', description: ''}, {title: '', description: ''}]);
 *
 *  return (
 *    <ul>
 *     {variants.map((fields, index) => (
 *       <li key={index}>
 *         <label htmlFor={`title-${index}`}>
 *           title{' '}
 *           <input
 *             id={`title-${index}`}
 *             name={`title-${index}`}
 *             value={fields.title.value}
 *             onChange={fields.title.onChange}
 *             onBlur={fields.title.onBlur}
 *           />
 *         </label>
 *         {field.title.error && <p>{field.title.error}</p>}
 *         <label htmlFor={`description-${index}`}>
 *           description{' '}
 *           <input
 *             id={`description-${index}`}
 *             name={`description-${index}`}
 *             value={fields.description.value}
 *             onChange={fields.description.onChange}
 *             onBlur={fields.description.onBlur}
 *           />
 *         </label>
 *         {field.description.error && <p>{field.description.error}</p>}
 *       </li>
 *      ))}
 *    </ul>
 *  );
 *}
 *```
 *
 * If using `@shopify/polaris` or other custom components that support `onChange`, `onBlur`, `value`, and `error` props then
 * you can accomplish the above more tersely by using the ES6 `spread` (...) operator.
 *
 * ```tsx
 * function MyComponent() {
 *  const title = useField([{title: '', description: ''}, {title: '', description: ''}]);
 *
 *  return (
 *    <ul>
 *     {variants.map((fields, index) => (
 *       <li key={index}>
 *         <TextField label="title" name={`title${index}`} {...fields.title} />
 *         <TextField
 *            label="description"
 *            id={`description${index}`}
 *            {...fields.description}
 *         />
 *       </li>
 *      ))}
 *    </ul>
 *   );
 * }
 * ```
 *
 * @param config - A configuration object specifying both the value and validation config.
 * @param validationDependencies - An array of dependencies to use to decide when to regenerate validators.
 * @returns A list of dictionaries of `Field` objects representing the state of your input. It also includes functions to manipulate that state. Generally, you will want to pass these callbacks down to the component or components representing your input.
 *
 * @remarks
 * **Reinitialization:** If the `list` property of the field configuration changes between calls to `useList`,
 * the field will be reset to use it as it's new default value.
 *
 * **Imperative methods:** The returned `Field` objects contains a number of methods used to imperatively alter their state.
 * These should only be used as escape hatches where the existing hooks and components do not make your life easy,
 * or to build new abstractions in the same vein as `useForm`, `useSubmit` and friends.
 */
export function useList<Item extends object>(
  {list, validates = {}}: FieldListConfig<Item>,
  validationDependencies: unknown[] = [],
): FieldDictionary<Item>[] {
  const [state, dispatch] = useListReducer(list);
  useEffect(
    () => {
      dispatch(reinitializeAction(list));
    },
    [list, dispatch],
  );

  const validationConfigs = useMemo(
    () =>
      mapObject<NormalizedValidationDictionary<any>>(
        validates,
        normalizeValidation,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validates, ...validationDependencies],
  );

  const handlers = useMemo(
    () => {
      return state.list.map((item, index) => {
        return mapObject<FieldDictionary<Item>>(
          item,
          <Key extends keyof Item & string>(
            field: FieldState<Item[Key]>,
            key: Key,
          ) => {
            const target = {index, key};

            function validate(value = field.value) {
              const validates = validationConfigs[key];

              if (validates == null) {
                return;
              }

              const siblings = state.list.filter(listItem => listItem !== item);

              runValidation(
                error =>
                  dispatch(
                    updateErrorAction<Item>({target, error: error || ''}),
                  ),
                {value, siblings, listItem: item},
                validates,
              );
            }

            return {
              onChange(value: Item[Key] | ChangeEvent) {
                const normalizedValue = (isChangeEvent(value)
                  ? value.target.value
                  : value) as Item[Key];

                dispatch(
                  updateAction({
                    target,
                    value: normalizedValue,
                  }),
                );

                if (field.error) {
                  validate(normalizedValue);
                }
              },
              reset() {
                dispatch(resetAction({target}));
              },
              newDefaultValue(value: Item[Key]) {
                dispatch(newDefaultAction({target, value}));
              },
              runValidation: validate,
              onBlur() {
                const {touched, error} = field;

                if (touched === false && error == null) {
                  return;
                }
                validate();
              },
            };
          },
        );
      });
    },
    [dispatch, state.list, validationConfigs],
  );

  return useMemo(
    () => {
      return state.list.map((item, index) => {
        return mapObject(item, (field, key: keyof Item) => {
          return {
            ...field,
            ...(handlers[index][key] as any),
          };
        });
      });
    },
    [state.list, handlers],
  );
}

function runValidation<Value, Record extends object>(
  updateError: (error: ErrorValue) => void,
  state: {
    value: Value;
    listItem: FieldStates<Record>;
    siblings: FieldStates<Record>[];
  },
  validators: Validator<Value, ListValidationContext<Record>>[],
) {
  const {value, listItem, siblings} = state;

  const error = validators
    .map(check =>
      check(value, {
        listItem,
        siblings,
      }),
    )
    .filter(value => value != null);

  if (error && error.length > 0) {
    const [firstError] = error;
    updateError(firstError);
    return firstError;
  }

  updateError(undefined);
}
