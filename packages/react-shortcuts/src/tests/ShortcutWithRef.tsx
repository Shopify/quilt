import React from 'react';

import Shortcut, {DefaultIgnoredTag} from '../Shortcut';

interface Props {
  spy: jest.Mock<{}>;
  focusNode?: boolean;
  tagName?: HTMLElement['tagName'];
  acceptedDefaultIgnoredTags?: DefaultIgnoredTag[];
}

export default function ShortcutWithFocus({
  spy,
  focusNode = true,
  tagName = 'button',
  acceptedDefaultIgnoredTags,
}: Props) {
  const [node, setNode] = React.useState<HTMLElement | null>(null);
  const elementWithFocus = React.createElement(tagName, {
    ref: (element: HTMLElement) => setNode(element),
  });

  React.useEffect(() => {
    if (!node) {
      return;
    }

    if (focusNode) {
      node.focus();
    }
  }, [node, focusNode]);

  return (
    <div className="app">
      {elementWithFocus}
      <Shortcut
        ordered={['z']}
        onMatch={spy}
        node={node}
        acceptedDefaultIgnoredTags={acceptedDefaultIgnoredTags}
      />
    </div>
  );
}
