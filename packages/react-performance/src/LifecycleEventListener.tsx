import type {LifecycleEventListener as LifecycleEventListenerType} from './lifecycle-event-listener';
import {useLifecycleEventListener} from './lifecycle-event-listener';

export function LifecycleEventListener({
  onEvent,
}: {
  onEvent: LifecycleEventListenerType;
}) {
  useLifecycleEventListener(onEvent);
  return null;
}
