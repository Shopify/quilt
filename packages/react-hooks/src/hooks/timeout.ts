import React from 'react';

export function useTimeout(callback: () => void, delay: number) {
  React.useEffect(() => {
    const id = setTimeout(callback, delay);
    return () => clearTimeout(id);
  }, [callback, delay]);
}
