import {ChangeEvent, useMemo} from 'react';

import {mapObject, isChangeEvent} from '../../../utilities';
import {
  FieldDictionary,
  FieldState,
  NormalizedValidationDictionary,
} from '../../../types';
import {runValidation} from '../utils';

import {
  updateAction,
  updateErrorAction,
  newDefaultAction,
  resetAction,
  ListState,
  ListAction,
} from './index';

export function useHandlers<Item extends object>(
  state: ListState<Item>,
  dispatch: React.Dispatch<ListAction<Item>>,
  validationConfigs: NormalizedValidationDictionary<any>,
) {
  return useMemo(() => {
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

            return runValidation(
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
            setError(error: string) {
              dispatch(updateErrorAction({target, error}));
            },
          };
        },
      );
    });
  }, [dispatch, state.list, validationConfigs]);
}
