---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Agents keep importing sqlalchemy straight into app/domain. Domain code is supposed to go through app/adapters/repository.py so we can swap storage later. Lock this down.

Input files: pyproject.toml, app/__init__.py, app/domain/__init__.py, app/domain/accounts.py, app/domain/billing.py, app/adapters/__init__.py, app/adapters/models.py, app/adapters/repository.py
