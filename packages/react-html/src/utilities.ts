export const SERIALIZE_ATTRIBUTE = 'data-serialized-id';

export function getSerializationsFromDocument() {
  const serializations = new Map<string, unknown>();

  if (typeof document === 'undefined') {
    return serializations;
  }

  for (const node of document.querySelectorAll(`[${SERIALIZE_ATTRIBUTE}]`)) {
    serializations.set(
      // eslint-disable-next-line typescript/no-non-null-assertion
      node.getAttribute(SERIALIZE_ATTRIBUTE)!,
      getSerializedFromNode(node),
    );
  }

  return serializations;
}

function getSerializedFromNode<Data>(node: Element): Data | undefined {
  const value = node.textContent;
  return value ? JSON.parse(value) : undefined;
}
