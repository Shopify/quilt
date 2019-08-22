import {EffectKind} from '@shopify/react-effect';
import {HYDRATION_ATTRIBUTE} from './shared';

const DEFAULT_HYDRATION_ID = Symbol('defaultId');
const DEFAULT_HYDRATION_PREFIX = 'hydration';

export const EFFECT_ID = Symbol('react-hydrate');

export class HydrationManager {
  hydrated = false;

  readonly effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => {
      this.ids.clear();
      this.hydration.clear();
    },
  };

  private readonly ids = new Map<
    string | typeof DEFAULT_HYDRATION_ID,
    number
  >();

  private readonly hydration = new Map<string, string>();

  constructor() {
    if (typeof document !== 'undefined') {
      for (const element of document.querySelectorAll(
        `[${HYDRATION_ATTRIBUTE}]`,
      )) {
        this.hydration.set(
          element.getAttribute(HYDRATION_ATTRIBUTE)!,
          element.innerHTML,
        );
      }
    }
  }

  hydrationId(id?: string) {
    const finalId = id || DEFAULT_HYDRATION_ID;
    const current = this.ids.get(finalId) || 0;
    this.ids.set(finalId, current + 1);
    return `${id || DEFAULT_HYDRATION_PREFIX}${current + 1}`;
  }

  getHydration(id: string) {
    return this.hydration.get(id);
  }
}
