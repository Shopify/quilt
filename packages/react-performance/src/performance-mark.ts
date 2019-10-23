import {usePerformanceEffect} from './performance-effect';

export function usePerformanceMark(stage: string, id: string) {
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
