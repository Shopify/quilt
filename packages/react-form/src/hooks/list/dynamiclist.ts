import type {FieldDictionary, FieldStates} from '../../types';

import {
  addFieldItemAction,
  editFieldItemAction,
  removeFieldItemAction,
  removeFieldItemsAction,
  moveFieldItemAction,
} from './hooks';
import type {FieldListConfig} from './baselist';
import {useBaseList} from './baselist';

export interface DynamicList<Item extends object> {
  fields: FieldDictionary<Item>[];
  addItem(factoryArgument?: any): void;
  editItem(item: FieldStates<Item>, index: number): void;
  removeItem(index: number): void;
  removeItems(indicesToRemove: number[]): void;
  moveItem(fromIndex: number, toIndex: number): void;
  reset(): void;
  dirty: boolean;
  value: Item[];
  defaultValue: Item[];
  newDefaultValue(newDefaultItems: Item[]): void;
}

type FactoryFunction<Item extends object> = (
  factoryArgument?: any,
) => Item | Item[];

/*
  A custom hook for dynamically adding and removing field items. This utilizes the base functionality of useBaseList.

* @param listOrConfig - A configuration object specifying both the value and validation config.
* @param fieldFactory - A factory function that produces field items according to the list items originally passed in for listOrConfig.
* @param validationDependencies - An array of dependencies to use to decide when to regenerate validators.
* @returns A list of dictionaries of `Field` objects representing the state of your input, an addItem function for adding list items (this calls your factory), and a removeItem function for removing list items by index.
*/

export function useDynamicList<Item extends object>(
  listOrConfig: FieldListConfig<Item> | Item[],
  fieldFactory: FactoryFunction<Item>,
  validationDependencies: unknown[] = [],
): DynamicList<Item> {
  const {fields, dispatch, reset, dirty, newDefaultValue, value, defaultValue} =
    useBaseList(listOrConfig, validationDependencies);

  function addItem(factoryArgument?: any) {
    const itemToAdd = fieldFactory(factoryArgument);

    if (Array.isArray(itemToAdd)) {
      dispatch(addFieldItemAction(itemToAdd));
    } else {
      dispatch(addFieldItemAction([itemToAdd]));
    }
  }

  function editItem(editedItem: FieldStates<Item>, index: number) {
    dispatch(editFieldItemAction(editedItem, index));
  }

  function moveItem(fromIndex: number, toIndex: number) {
    dispatch(moveFieldItemAction(fromIndex, toIndex));
  }

  function removeItem(index: number) {
    dispatch(removeFieldItemAction(index));
  }

  function removeItems(indicesToRemove: number[]) {
    dispatch(removeFieldItemsAction(indicesToRemove));
  }

  return {
    fields,
    addItem,
    editItem,
    removeItem,
    removeItems,
    moveItem,
    reset,
    dirty,
    value,
    newDefaultValue,
    defaultValue,
  };
}
