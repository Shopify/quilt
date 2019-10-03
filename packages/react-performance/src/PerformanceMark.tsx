import {usePerformanceMark, Stage} from './performance-mark';

interface Props {
  id: string;
  stage: Stage;
}

export function PerformanceMark({stage, id}: Props) {
  usePerformanceMark(stage, id);

  return null;
}
