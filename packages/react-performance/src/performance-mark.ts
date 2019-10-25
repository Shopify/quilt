import {usePerformanceEffect} from './performance-effect';
import {Stage} from './types';

export function usePerformanceMark(stage: string, id: string) {
  usePerformanceEffect(
    performance => {
      if (stage === Stage.Complete) {
        performance.finish();
      } else if (stage === Stage.Usable) {
        performance.usable();
      }

      performance.mark(stage, id);
    },
    [stage, id],
  );
}
