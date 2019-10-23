import React from 'react';
import ShortcutManager from '../ShortcutManager';

export interface Props {
  children?: React.ReactNode;
}

export const ShortcutContext = React.createContext<ShortcutManager | null>(
  null,
);

export const {Consumer, Provider} = ShortcutContext;

export default function ShortcutProvider({children}: Props) {
  const shortcutManager = React.useRef(new ShortcutManager());

  React.useEffect(() => {
    shortcutManager.current.setup();
  }, []);

  return (
    <ShortcutContext.Provider value={shortcutManager.current}>
      {children}
    </ShortcutContext.Provider>
  );
}
