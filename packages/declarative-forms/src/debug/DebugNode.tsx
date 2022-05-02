import React, {useEffect, useRef, useState} from 'react';

import {NodeProps} from '../types';

interface DebugProps extends NodeProps {
  children?: React.ReactNode;
}

const colors = ['#4488ff', '#ff8800', '#ff00ff', '#22ff44', '#ff0088'];

function getColor(index: number) {
  return colors[index % colors.length];
}

export function DebugNode({children, node}: DebugProps) {
  const ref = useRef<HTMLDivElement>();
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<Partial<DOMRect>>({});
  const rootValue = node.getNodeByPath('')!.value;
  useEffect(() => {
    const to = setTimeout(calculateBoundRect, 0);
    addEventListener('resize', calculateBoundRect);
    return () => {
      clearTimeout(to);
      removeEventListener('resize', calculateBoundRect);
    };
  }, [rootValue]);
  const color = getColor(node.depth);
  const overlayStyle = {
    boxShadow: `inset 0 0 3px 1px ${color}, inset -.5em 0 2em -.5em ${color}44, 0 0 1em 1px ${color}44`,
    textShadow: `0 0 1px white`,
    backgroundColor: `${color}08`,
    borderRadius: '.25em .25em 0 0',
    zIndex: 999,
    left: -10,
    top: 1,
    width: (rect.width || 0) + 20,
    height: (rect.height || 0) + 10,
  };

  const errorCount = node.errors.length + node.invalidChildren.size;

  return (
    <div
      style={{
        position: 'relative',
        // minHeight is to make sure there is always something we can over if the node renders nothing
        minHeight: '1em',
      }}
      ref={ref as any}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            style={{
              ...overlayStyle,
              backgroundColor: `${color}dd`,
              position: 'absolute',
              transform: 'translateY(calc(1px - 100%))',
              height: 'auto',
              boxSizing: 'border-box',
              padding: '.5em',
              overflowX: 'auto',
            }}
            onClick={() => {
              // eslint-disable-next-line no-console
              console.info(node.path.toString(), node);
            }}
          >
            <DebugAttribute name="label" value={node.translate('label')} />
            {(['type', 'name', 'depth'] as const).map((key) => (
              <DebugAttribute key={key} name={key} value={node[key]} />
            ))}
            <DebugAttribute name="path" value={node.path.toString()} />
            <DebugAttribute
              name="pathShort"
              value={node.path.toStringShort()}
            />
            <DebugAttribute name="value" value={node.value} />
            <DebugAttribute name="errorCount" value={errorCount} />
          </div>
          <div
            style={{
              ...overlayStyle,
              position: 'absolute',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {children}
    </div>
  );

  function calculateBoundRect() {
    if (ref.current) {
      const div = ref.current;
      setRect(div.getBoundingClientRect());
    }
  }
}

function DebugAttribute({
  name,
  value,
}: {
  name: string;
  value: string | number | boolean;
}) {
  let displayValue = value;
  if (typeof value === 'boolean') {
    displayValue = value ? 'true' : 'false';
  } else if (Array.isArray(value)) {
    displayValue = `Array(${value.length})`;
  } else if (typeof value === 'object') {
    displayValue = `[${Object.keys(value).length} nodes]`;
  }
  return (
    <span style={{color: '#111'}}>
      {name}=&quot;
      <i>
        <span style={{color: 'black'}}>{displayValue}</span>
      </i>
      &quot;{' '}
    </span>
  );
}
