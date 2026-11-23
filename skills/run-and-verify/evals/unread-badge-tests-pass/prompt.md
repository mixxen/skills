---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

I fixed the unread badge so it clears when you open the inbox (changed markAllRead in src/inbox.mjs and the /inbox handler in server.mjs). Tests pass. Can you check it before I open the PR?

Input files: package.json, server.mjs, src/inbox.mjs, src/inbox.test.mjs, scripts/drive.mjs, docs/feature-map.md
