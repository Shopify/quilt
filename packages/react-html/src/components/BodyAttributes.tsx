import {useBodyAttributes} from '../hooks';

type Props = Parameters<typeof useBodyAttributes>[0];

export function BodyAttributes(props: Props) {
  useBodyAttributes(props);
  return null;
}
