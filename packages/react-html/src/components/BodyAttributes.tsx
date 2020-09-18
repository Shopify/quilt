import {FirstArgument} from '@shopify/useful-types';

import {useBodyAttributes} from '../hooks';

type Props = FirstArgument<typeof useBodyAttributes>;

export function BodyAttributes(props: Props) {
  useBodyAttributes(props);
  return null;
}
