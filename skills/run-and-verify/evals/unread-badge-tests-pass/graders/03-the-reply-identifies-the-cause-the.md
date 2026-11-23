---
type: llm
focus: trace
weight: 1
---

The reply identifies the cause: the /inbox handler calls markAllRead(messages) but discards its return value, citing server.mjs with a line number (line 23).
