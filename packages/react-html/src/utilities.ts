export const SERIALIZE_ATTRIBUTE = 'data-serialized-id';
export const MANAGED_ATTRIBUTE = 'data-react-html';

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

  try {
    return value ? JSON.parse(value) : undefined;
  } catch {
    return undefined;
  }
}

export function getSerialized<Data>(id: string) {
  const node = document.querySelector(`[${SERIALIZE_ATTRIBUTE}="${id}"]`);

  if (node == null) {
    throw new Error(`No serializations found for id "${id}"`);
  }

  return getSerializedFromNode<Data>(node);
}

// We hide the document in development by default in order to prevent
// flashes of unstyled content. This function will show the document
// after the styles have loaded.
export function showPage(): Promise<void> {
  return (
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV === 'development' && typeof document !== 'undefined'
      ? new Promise((resolve) => {
          setTimeout(() => {
            document.body.style.display = '';
            resolve();
          }, 0);
        })
      : Promise.resolve()
  );
}
