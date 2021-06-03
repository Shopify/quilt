import React from 'react';

import Shortcut from '../Shortcut';

interface Props {
  spy: jest.Mock<{}>;
}

export default function ShortcutWithFocusedInput(props: Props) {
  const {spy} = props;
  const node = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!node || !node.current) {
      return;
    }

    node.current.focus();
  }, [node]);
  return (
    <div className="app">
      <div contentEditable={true} ref={node}>
        <Shortcut ordered={['z']} onMatch={spy} node={node.current} />
      </div>
    </div>
  );
}
