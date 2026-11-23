---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

we moved to date-fns months ago but moment is still all over the place and agents keep adding new moment imports. get rid of it.

Input files: package.json, eslint.config.js, src/utils/format.ts, src/pages/Invoice.tsx, src/pages/Report.tsx, src/pages/Receipt.ts, src/pages/Receipt.test.ts, src/utils/format.test.ts
