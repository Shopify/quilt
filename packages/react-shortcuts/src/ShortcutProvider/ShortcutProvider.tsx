import * as React from 'react';
import ShortcutManager from '../ShortcutManager';

export interface Props {
  children?: React.ReactNode;
}

export const ShortcutContext = React.createContext<ShortcutManager | null>(
  null,
);

export const {Consumer, Provider} = ShortcutContext;
export default class ShortcutProvider extends React.Component<Props, never> {
  private shortcutManager = new ShortcutManager();

  componentDidMount() {
    this.shortcutManager.setup();
  }

  render() {
    return (
      <ShortcutContext.Provider value={this.shortcutManager}>
        {this.props.children}
      </ShortcutContext.Provider>
    );
  }
}
