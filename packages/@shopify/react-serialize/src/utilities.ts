export interface Serialized<Data, Details> {
  data: Data;
  details: Details;
}

export function getSerialized<Data = {}, Details = {}>(
  id: string,
): Serialized<Data, Details> {
  const node = document.getElementById(serializedID(id));
  if (node == null) {
    throw new Error(`No serialized data found with the id '${id}'`);
  }

  const {serializedDetails} = node.dataset;

  return {
    data: JSON.parse(node.innerHTML),
    details: serializedDetails ? JSON.parse(serializedDetails) : {},
  };
}

export function serializedID(id: string) {
  return `SerializedData-${id}`;
}
