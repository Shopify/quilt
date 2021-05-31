import {useReducer, Reducer} from 'react';

import {FieldStates, ErrorValue} from '../../../types';
import {
  reduceField,
  FieldAction,
  updateErrorAction as updateFieldError,
  initialFieldState,
} from '../../field';
import {mapObject} from '../../../utilities';

export type ListAction<Item> =
  | ReinitializeAction<Item>
  | AddFieldItemAction<Item>
  | MoveFieldItemAction
  | RemoveFieldItemAction
  | UpdateErrorAction<Item>
  | UpdateAction<Item, keyof Item>
  | ResetAction<Item, keyof Item>
  | NewDefaultAction<Item, keyof Item>
  | ResetListAction;

interface ReinitializeAction<Item> {
  type: 'reinitialize';
  payload: {list: Item[]};
}

interface AddFieldItemAction<Item> {
  type: 'addFieldItem';
  payload: {list: Item[]};
}

interface MoveFieldItemAction {
  type: 'moveFieldItem';
  payload: {fromIndex: number; toIndex: number};
}

interface ResetListAction {
  type: 'resetList';
}

interface RemoveFieldItemAction {
  type: 'removeFieldItem';
  payload: {indexToRemove: number};
}

interface TargetedPayload<Item, Key extends keyof Item> {
  target: {
    index: number;
    key: Key;
  };
  value: Item[Key];
}

interface UpdateErrorAction<Item> {
  type: 'updateError';
  payload: {
    target: {
      index: number;
      key: keyof Item;
    };
    error: ErrorValue;
  };
}

interface ResetAction<Item, Key extends keyof Item> {
  type: 'reset';
  payload: {
    target: {
      index: number;
      key: Key;
    };
  };
}

interface UpdateAction<Item, Key extends keyof Item> {
  type: 'update';
  payload: TargetedPayload<Item, Key>;
}

interface NewDefaultAction<Item, Key extends keyof Item> {
  type: 'newDefaultValue';
  payload: TargetedPayload<Item, Key>;
}

export function reinitializeAction<Item>(
  list: Item[],
): ReinitializeAction<Item> {
  return {
    type: 'reinitialize',
    payload: {list},
  };
}

export function addFieldItemAction<Item>(
  list: Item[],
): AddFieldItemAction<Item> {
  return {
    type: 'addFieldItem',
    payload: {list},
  };
}

export function moveFieldItemAction(
  fromIndex: number,
  toIndex: number,
): MoveFieldItemAction {
  return {
    type: 'moveFieldItem',
    payload: {fromIndex, toIndex},
  };
}

export function removeFieldItemAction(
  indexToRemove: number,
): RemoveFieldItemAction {
  return {
    type: 'removeFieldItem',
    payload: {indexToRemove},
  };
}

export function updateAction<Item, Key extends keyof Item>(
  payload: TargetedPayload<Item, Key>,
): UpdateAction<Item, Key> {
  return {
    type: 'update',
    payload,
  };
}

export function resetAction<Item, Key extends keyof Item>(
  payload: ResetAction<Item, Key>['payload'],
): ResetAction<Item, Key> {
  return {
    type: 'reset',
    payload,
  };
}

export function resetListAction(): ResetListAction {
  return {
    type: 'resetList',
  };
}

export function newDefaultAction<Item, Key extends keyof Item>(
  payload: TargetedPayload<Item, Key>,
): NewDefaultAction<Item, Key> {
  return {
    type: 'newDefaultValue',
    payload,
  };
}

export function updateErrorAction<Item>(
  payload: UpdateErrorAction<Item>['payload'],
): UpdateErrorAction<Item> {
  return {
    type: 'updateError',
    payload,
  };
}

export interface ListState<Item extends object> {
  list: FieldStates<Item>[];
  initial: Item[];
}

export function useListReducer<Item extends object>(initial: Item[]) {
  return useReducer<Reducer<ListState<Item>, ListAction<Item>>>(reduceList, {
    list: initial.map(initialListItemState),
    initial,
  });
}

function reduceList<Item extends object>(
  state: ListState<Item>,
  action: ListAction<Item>,
) {
  switch (action.type) {
    case 'reinitialize': {
      return {
        initial: action.payload.list,
        list: action.payload.list.map(initialListItemState),
      };
    }
    case 'moveFieldItem': {
      const {fromIndex, toIndex} = action.payload;
      if (
        fromIndex >= state.list.length ||
        fromIndex < 0 ||
        toIndex >= state.list.length ||
        toIndex < 0
      ) {
        throw new Error(`Failed to move item from ${fromIndex} to ${toIndex}`);
      }

      const newList = [...state.list];
      const [item] = newList.splice(action.payload.fromIndex, 1);
      newList.splice(action.payload.toIndex, 0, item);

      return {
        ...state,
        list: newList,
      };
    }
    case 'addFieldItem': {
      return {
        ...state,
        list: [...state.list, ...action.payload.list.map(initialListItemState)],
      };
    }
    case 'removeFieldItem': {
      const newList = [...state.list];
      newList.splice(action.payload.indexToRemove, 1);
      return {
        ...state,
        list: newList,
      };
    }
    case 'updateError': {
      const {
        payload: {target, error},
      } = action;
      const {index, key} = target;
      const currentItem = state.list[index];

      currentItem[key] = reduceField(
        currentItem[key],
        updateFieldError(error),
      ) as any;

      return {...state, list: [...state.list]};
    }
    case 'reset': {
      const {
        payload: {target},
      } = action;
      const {index, key} = target;
      const currentItem = state.list[index];

      currentItem[key] = reduceField(currentItem[key], {type: 'reset'});

      return {...state, list: [...state.list]};
    }
    case 'resetList': {
      return {...state, list: state.initial.map(initialListItemState)};
    }
    case 'update':
    case 'newDefaultValue': {
      const {
        payload: {target, value},
      } = action;
      const {index, key} = target;
      const currentItem = state.list[index];

      currentItem[key] = reduceField(currentItem[key], {
        type: action.type,
        payload: value,
      } as FieldAction<typeof value>);

      return {...state, list: [...state.list]};
    }
  }
}

function initialListItemState<Item extends object>(item: Item) {
  return mapObject<FieldStates<Item>>(item, initialFieldState);
}
