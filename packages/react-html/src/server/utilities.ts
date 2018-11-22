import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

export function render(tree: React.ReactElement<unknown>) {
  return `<!DOCTYPE html>${renderToStaticMarkup(tree)}`;
}
