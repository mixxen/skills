# Feature map template

A feature map gives people and agents the same names for the same things. Write entries from the user's point of view: what they see and call it, not the component name.

Keep one file (for example `docs/feature-map.md`) and one entry per feature:

```
## [Feature name users say] (aliases: [other names people use])
Where: [screen > area > element, e.g. Main window > left sidebar > channel list]
What the user can do: [actions, one line each]
Reach it with the driver: [command, e.g. `pnpm drive open-channel general`]
Code: [entry points, e.g. src/features/channels/]
Shares state with: [other features that can break when this one changes]
```

Example:

```
## Channel list (aliases: sidebar, left panel)
Where: Main window > left sidebar
What the user can do: open a channel; reorder by dragging; mute from the context menu
Reach it with the driver: `pnpm drive channels list`, `pnpm drive channels open <name>`
Code: src/features/channels/
Shares state with: Unread badges, Search results
```

"Shares state with" is the field that pays off most: it tells the verifier which nearby feature to check for regressions.
