import React, {useEffect, useRef} from 'react';
import {createMount} from '@shopify/react-testing';
import '@shopify/react-testing/matchers';

import {
  NodeProps,
  SchemaNode,
  SharedContext,
  SchemaNodeDecoratorSafeAttributes,
} from '../types';
import {useNode} from '../utilities/hook';
import {renderNodes} from '../utilities/RenderNode';
import {DeclarativeFormContext} from '../DeclarativeFormContext';

export const translators = {
  label: translateLabel,
  error: translateError,
};

interface Options {}

interface Context {}

export const mountWithContext = createMount<Options, Context, true>({
  context() {
    return {};
  },

  render(element) {
    return element;
  },

  async afterMount() {},
});

export function ListNode({node}: NodeProps) {
  const {value} = useNode(node);
  return (
    <section className="list-container">
      {value.map((item: SchemaNode) => {
        return (
          <div
            key={item.uid}
            className="list-item"
            title={item.path.toString()}
          >
            {renderNodes({item}, `list_child_${item.uid}`)}
          </div>
        );
      })}
    </section>
  );
}

export function ItemDeleteButton({node}: NodeProps) {
  return (
    <button type="button" name={node.name} onClick={handleDelete}>
      Delete
    </button>
  );

  function handleDelete() {
    const index = Number(node.name);
    node.parentNode()?.removeListItem(index);
  }
}

export function decorate(context: DeclarativeFormContext<SharedContext>) {
  context
    .where(({type}: SchemaNodeDecoratorSafeAttributes) => type === 'string')
    .replaceWith(StringNode);

  context
    .where(({type}: SchemaNodeDecoratorSafeAttributes) => type === 'integer')
    .replaceWith(StringNode, {type: 'number'});

  context
    .where(({isList}: SchemaNodeDecoratorSafeAttributes) => Boolean(isList))
    .replaceWith(ListNode);
}

/**
 * Fake component to handle field nodes
 */
interface TextNodeProps extends NodeProps {
  type: React.InputHTMLAttributes<HTMLInputElement>['type'];
}

export function StringNode({node, type}: TextNodeProps) {
  const {errorMessage, focused} = useNode(node);
  const inputElement = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputElement.current) return;
    inputElement.current[focused ? 'focus' : 'blur']();
  }, [focused]);

  const errorJsx = errorMessage ? <strong>{errorMessage}</strong> : null;

  return (
    <>
      <input
        name={node.path.toString()}
        ref={inputElement}
        onChange={handleChange}
        type={type}
      />
      {errorJsx}
    </>
  );

  function handleChange(ev: any) {
    node.onChange(ev.target.value);
  }
}

export function translateError(_: SchemaNode, {error = null}: any) {
  return error.type === 'server' ? error.data?.error : error.type;
}
export function translateLabel(node: SchemaNode) {
  return node.name;
}

export async function mountDeclarativeForm({
  schema = {},
  customDecorator = decorate,
  customTranslators = translators,
  features = {} as DeclarativeFormContext['features'],
}) {
  const context = new DeclarativeFormContext({
    decorate: customDecorator,
    translators: customTranslators,
    features,
  });
  const node = new SchemaNode(context, schema);
  const wrapper = await mountWithContext(
    <section>{renderNodes({node})}</section>,
  );

  return {wrapper, node};
}
