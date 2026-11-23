---
type: llm
focus: trace
weight: 1
---

MessageList.tsx's 50ms timer is not replaced by another timer or requestAnimationFrame: either the scroll follows the store update (for example an effect keyed on messages) or the entry stays in the baseline with a stated reason.
