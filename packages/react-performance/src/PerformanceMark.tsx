import {usePerformanceMark} from './performance-mark';

interface Props {
  id: string;
  stage: string;
}

export function PerformanceMark({stage, id}: Props) {
  usePerformanceMark(stage, id);

  return null;
}
