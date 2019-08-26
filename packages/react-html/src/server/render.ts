import {ReactElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

export default function render(tree: ReactElement<unknown>) {
  return `<!DOCTYPE html>${renderToStaticMarkup(tree)}`;
}
