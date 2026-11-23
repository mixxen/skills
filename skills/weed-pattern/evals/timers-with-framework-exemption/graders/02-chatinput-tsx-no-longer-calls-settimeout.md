---
type: llm
focus: trace
weight: 1
---

ChatInput.tsx no longer calls setTimeout and uses the framework scheduler (scheduleAfterRender) instead.
