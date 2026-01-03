import { DestroyRef, inject } from "@angular/core";
import { MessageBroker } from "./MessageBroker";

export function listenTo(topic: string, listener: (message: object) => void): void {
  const broker = inject(MessageBroker);
  const unsubscribe = broker.subscribe(topic, listener);
  const destroyRef = inject(DestroyRef);
  destroyRef.onDestroy(() => {
    unsubscribe();
  });
}
