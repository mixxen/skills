---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

The agent misread the ticket and built the /exports endpoint to return CSV instead of JSON. I caught it in review and it's fixed now. Can you make sure agents don't make this mistake again?

Input files: package.json, AGENTS.md, src/app.js, src/server.js, src/routes/health.js, src/routes/health.test.js, src/routes/exports.js, src/data/exports.js
