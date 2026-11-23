import { useMessageStore } from "../../framework/store";

export function MessageList({ listRef }: { listRef: { current: HTMLDivElement | null } }) {
  const messages = useMessageStore((s) => s.messages);
  const onNewMessage = () => {
    // the message store updates late, so wait 50ms before scrolling to the bottom
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, 50);
  };
  return <div ref={listRef} onLoad={onNewMessage}>{messages.map((m) => <p key={m.id}>{m.text}</p>)}</div>;
}
