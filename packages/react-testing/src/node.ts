import {Root} from './root';
import {Element} from './element';

export type Node<Props> = Root<Props> | Element<Props>;
