import {usePerformanceEffect} from './performance-effect';

export type Stage = 'complete' | 'usable';

export function usePerformanceMark(stage: Stage, id: string) {
  usePerformanceEffect(
    performance => {
      if (stage === 'complete') {
        performance.finish();
      } else if (stage === 'usable') {
        performance.usable();
      }

      performance.mark(stage, id);
    },
    [stage, id],
  );
}
