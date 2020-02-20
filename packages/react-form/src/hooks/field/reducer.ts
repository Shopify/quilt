import {useReducer, Reducer} from 'react';

import {FieldState, ErrorValue, DirtyStateComparator} from '../../types';
import {defaultDirtyComparator} from '../../utilities';

interface UpdateErrorAction {
  type: 'updateError';
  payload: ErrorValue;
}

interface ResetAction {
  type: 'reset';
}

interface UpdateAction<Value> {
  type: 'update';
  payload: Value;
}

interface NewDefaultAction<Value> {
  type: 'newDefaultValue';
  payload: Value;
}

export function updateAction<Value>(value: Value): UpdateAction<Value> {
  return {
    type: 'update',
    payload: value,
  };
}

export function resetAction(): ResetAction {
  return {
    type: 'reset',
  };
}

export function newDefaultAction<Value>(value: Value): NewDefaultAction<Value> {
  return {
    type: 'newDefaultValue',
    payload: value,
  };
}

export function updateErrorAction(error: ErrorValue): UpdateErrorAction {
  return {
    type: 'updateError',
    payload: error,
  };
}

export type FieldAction<Value> =
  | UpdateErrorAction
  | ResetAction
  | UpdateAction<Value>
  | NewDefaultAction<Value>;

export function makeFieldReducer<Value>({
  dirtyStateComparator,
}: {
  dirtyStateComparator: DirtyStateComparator<Value>;
}): Reducer<FieldState<Value>, FieldAction<Value>> {
  return (state: FieldState<Value>, action: FieldAction<Value>) => {
    switch (action.type) {
      case 'update': {
        const newValue = action.payload;
        const {defaultValue} = state;
        const dirty = dirtyStateComparator(defaultValue, newValue);

        return {
          ...state,
          dirty,
          value: newValue,
          touched: true,
        };
      }

      case 'updateError': {
        return {
          ...state,
          error: action.payload,
        };
      }

      case 'reset': {
        const {defaultValue} = state;

        return {
          ...state,
          error: undefined,
          value: defaultValue,
          dirty: false,
          touched: false,
        };
      }

      case 'newDefaultValue': {
        const newDefaultValue = action.payload;
        return {
          ...state,
          error: undefined,
          value: newDefaultValue,
          defaultValue: newDefaultValue,
          touched: false,
          dirty: false,
        };
      }
    }
  };
}

const shallowFieldReducer = makeFieldReducer({
  dirtyStateComparator: defaultDirtyComparator,
});

export function reduceField<Value>(
  prevState: FieldState<Value>,
  action: FieldAction<Value>,
): FieldState<Value> {
  return shallowFieldReducer(prevState, action) as FieldState<Value>;
}

export function useFieldReducer<Value>(
  value: Value,
  dirtyStateComparator: DirtyStateComparator<Value>,
) {
  return useReducer(
    makeFieldReducer<Value>({dirtyStateComparator}),
    initialFieldState(value),
  );
}

export function initialFieldState<Value>(value: Value): FieldState<Value> {
  return {
    value,
    defaultValue: value,
    error: undefined,
    touched: false,
    dirty: false,
  };
}
