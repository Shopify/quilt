import { Generation } from "./Generation";
export { Generation };
export interface Person {
  __typename: "Person";
  id: string;
  name: string;
  generation: Generation;
  relatives: Person[];
}
export interface Query {
  person?: Person | null;
}