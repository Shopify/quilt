import {ClientApplication} from '@shopify/app-bridge';
import useRoutePropagation from './hook';
import {LocationOrHref} from './types';

export interface Props {
  app: ClientApplication<any>;
  location: LocationOrHref;
}

export default function RoutePropagator({app, location}: Props) {
  useRoutePropagation(app, location);
  return null;
}
