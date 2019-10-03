import {
  useLifecycleEventListener,
  LifecycleEventListener as LifecycleEventListenerType,
} from './lifecycle-event-listener';

export function LifecycleEventListener({
  onEvent,
}: {
  onEvent: LifecycleEventListenerType;
}) {
  useLifecycleEventListener(onEvent);
  return null;
}
