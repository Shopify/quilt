import {FieldDictionary} from '../../types';

import {addFieldItemAction, removeFieldItemAction} from './hooks';
import {useBaseList, FieldListConfig} from './baselist';

interface DynamicList<Item extends object> {
  fields: FieldDictionary<Item>[];
  addItem(): void;
  removeItem(index: number): void;
}

type FactoryFunction<Item> = () => Item;

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
  const {fields, dispatch} = useBaseList(listOrConfig, validationDependencies);

  function addItem() {
    dispatch(addFieldItemAction([fieldFactory()]));
  }

  function removeItem(index: number) {
    dispatch(removeFieldItemAction(index));
  }

  return {fields, addItem, removeItem};
}
