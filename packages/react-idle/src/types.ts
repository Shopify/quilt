export {
  RequestIdleCallback,
  RequestIdleCallbackOptions,
  RequestIdleCallbackDeadline,
  RequestIdleCallbackHandle,
  WindowWithRequestIdleCallback,
} from '@shopify/async';

export enum UnsupportedBehavior {
  Immediate,
  AnimationFrame,
}
