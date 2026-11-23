import { test } from "node:test";
import assert from "node:assert/strict";
import { markAllRead, unreadCount } from "./inbox.mjs";

const sample = () => [
  { id: 1, read: false, archived: false },
  { id: 2, read: true, archived: false },
];

test("unreadCount counts unread messages", () => {
  assert.equal(unreadCount(sample()), 1);
});

test("markAllRead marks every message read", () => {
  assert.equal(unreadCount(markAllRead(sample())), 0);
});
