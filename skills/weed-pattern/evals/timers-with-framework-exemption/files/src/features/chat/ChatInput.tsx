import { useRef } from "react";

export function ChatInput({ onOpen }: { onOpen: (cb: () => void) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  onOpen(() => {
    // wait for the DOM to update before focusing
    setTimeout(() => inputRef.current?.focus(), 0);
  });
  return <input ref={inputRef} />;
}
