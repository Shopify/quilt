import {useReducer, Reducer} from 'react';
import {FieldState, ErrorValue} from '../../types';

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

export function reduceField<Value>(
  state: FieldState<Value>,
  action: FieldAction<Value>,
) {
  switch (action.type) {
    case 'update': {
      const newValue = action.payload;
      const {defaultValue} = state;

      return {
        ...state,
        dirty: defaultValue !== newValue,
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
}

export function useFieldReducer<Value>(value: Value) {
  return useReducer<Reducer<FieldState<Value>, FieldAction<Value>>>(
    reduceField,
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
