import * as React from 'react';
import ShortcutManager from './ShortcutManager';

const {Provider, Consumer} = React.createContext<ShortcutManager>(
  new ShortcutManager(),
);

export {Consumer};

export interface Props {
  children?: React.ReactChildren;
}

export interface WithShortcutManagerProps {
  shortcutManager: ShortcutManager;
}

type ComposedProps = Props & WithShortcutManagerProps;

class ShortcutProvider extends React.Component<ComposedProps, never> {
  componentDidMount() {
    this.props.shortcutManager.setup();
  }

  render() {
    return this.props.children;
  }
}

export default React.forwardRef<any, Props>((props, ref) => (
  <Provider value={new ShortcutManager()}>
    {shortcutManager => (
      <ShortcutProvider
        {...props}
        shortcutManager={shortcutManager}
        ref={ref}
      />
    )}
  </Provider>
));
