import React from 'react';
import Shortcut from '../Shortcut';

interface Props {
  spy: jest.Mock<{}>;
}

export default function ShortcutWithFocus(props: Props) {
  const {spy} = props;
  const node = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!node || !node.current) {
      return;
    }

    node.current.focus();
  }, [node]);
  return (
    <div className="app">
      <button type="button" ref={node} />
      <Shortcut ordered={['z']} onMatch={spy} node={node.current} />
    </div>
  );
}
