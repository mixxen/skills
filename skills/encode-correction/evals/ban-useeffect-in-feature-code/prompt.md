---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

reviewers keep flagging useEffect in our feature components. the agents use it to copy props into state or derive filtered lists and it causes extra renders. the legit cases (subscriptions etc) already have hooks in src/framework. can you make sure this stops happening?

Input files: package.json, eslint.config.js, AGENTS.md, src/framework/useSubscription.ts, src/features/chat/ChatList.tsx, src/features/settings/Settings.tsx
