import { useSyncExternalStore } from "react";

type Message = { id: string; text: string };
type State = { messages: Message[] };

let state: State = { messages: [] };
const listeners = new Set<() => void>();

// Incoming messages are batched and applied on the next microtask, so a component
// sees a new message one render after the event that delivered it.
export function addMessage(message: Message) {
  queueMicrotask(() => {
    state = { messages: [...state.messages, message] };
    listeners.forEach((listener) => listener());
  });
}

export function useMessageStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => select(state),
  );
}
