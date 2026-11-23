export function unreadCount(messages) {
  return messages.filter((m) => !m.read).length;
}

export function markAllRead(messages) {
  return messages.map((m) => ({ ...m, read: true }));
}
