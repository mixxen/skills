---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

We banned setTimeout in feature code last week but there are still 4 entries in lint-baseline.json. Can you clean them up?

Input files: eslint.config.js, lint-baseline.json, src/framework/scheduler.ts, src/features/chat/ChatInput.tsx, src/features/chat/MessageList.tsx, src/features/settings/Theme.tsx, src/features/legacy/OldBanner.tsx, src/framework/store.ts
