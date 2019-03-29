import {Root} from '../root';
import {Element} from '../element';

export {Root, Element};

export type Node<Props> = Root<Props> | Element<Props>;
