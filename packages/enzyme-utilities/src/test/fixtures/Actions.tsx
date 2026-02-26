import * as React from 'react';

export interface Handler {
  onAction(): any;
  name: string;
}

export interface ActionProps {
  handler: Handler;
}

export interface ActionListProps {
  handlers: Handler[];
}

export function Action({handler: {onAction, name}}: ActionProps) {
  return <button type="button" key={name} onClick={onAction} />;
}

export function ActionList({handlers}: ActionListProps) {
  const actionsMarkup = handlers.map(handler => (
    <Action key={handler.name} handler={handler} />
  ));

  return <>{actionsMarkup}</>;
}
