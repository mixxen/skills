import { useEffect, useState } from "react";

export function ChatList({ chats, query }: { chats: { id: string; title: string }[]; query: string }) {
  const [visible, setVisible] = useState(chats);
  useEffect(() => {
    setVisible(chats.filter((c) => c.title.includes(query)));
  }, [chats, query]);
  return <ul>{visible.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;
}
