import {useState} from 'react';

export function useAsyncActionState<T>(
  action: () => Promise<T>,
): [boolean, () => Promise<T>] {
  const [inProgress, setInProgress] = useState(false);
  async function handleEvent() {
    try {
      setInProgress(true);
      return await action();
    } finally {
      setInProgress(false);
    }
  }
  return [inProgress, handleEvent];
}
