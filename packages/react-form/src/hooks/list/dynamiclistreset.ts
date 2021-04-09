import {useCallback} from 'react';
import {useLazyRef} from '@shopify/react-hooks';

import {DynamicListBag} from '../../types';

export function useDynamicListReset(lists?: DynamicListBag) {
  const listBagRef = useLazyRef(() => lists);
  listBagRef.current = lists;

  return useCallback(() => {
    return resetFields(listBagRef.current);
  }, [listBagRef]);
}

function resetFields(lists?: DynamicListBag) {
  if (lists) {
    Object.entries(lists).forEach(([key]) => lists[key].reset());
  }
}
