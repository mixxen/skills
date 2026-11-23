---
name: harvest-corrections
description: Mine recent PR review comments, reverts and changes to agent rules files for corrections that keep recurring, group them, and rank which to turn into automatic checks next, along with a summary of what human review still catches. Use this when the user asks what keeps coming up in code review, what to lint or automate next, why review is a bottleneck, which agent mistakes repeat, or wants a weekly or monthly review of corrections. Hand the top items to encode-correction.
metadata:
  version: "0.1"
  source: "Based on Lauren Tan, All Code Is Slop (Except Mine), AI Engineer Code Summit 2026"
---

# Harvest corrections

The ideal is to turn every correction into a check the moment it happens. In practice teams fall behind, and the same comments keep appearing in review. This skill finds them in the history and ranks what to encode next. It also shows what review still catches, which is how you tell whether review is actually shrinking.

## Inputs

Default window: the last 30 days, or since the previous harvest report if the user keeps them. Sources, most useful first:

1. **PR review comments**, both inline and in the PR conversation.
2. **Reverts**: commits that undo earlier work, and the reason given.
3. **Changes to agent rules files** such as AGENTS.md, CLAUDE.md and rules directories. Each added "don't" line is a correction someone wrote as prose instead of code.
4. **Agent session logs**, only if the user points you to them. Don't go looking through personal logs.

For GitHub repositories, `scripts/collect_corrections.py` gathers sources 1 to 3 as JSON lines. Run it from inside the repository:

```
python scripts/collect_corrections.py --since 2026-10-22 --out corrections.jsonl
```

It needs `git` and a signed-in `gh` CLI, and it skips bot accounts. For other hosts, pass `--no-github` to collect the git sources only, and fetch review comments with that host's CLI or API.

## 1. Turn comments into corrections

Read each item and rewrite it as "wrong → right" in one line. Drop:

- approvals, questions and conversation;
- comments about one change only (a wrong value, a typo, a misunderstood requirement);
- comments that an existing check already catches.

If an existing check should have caught something and didn't, keep that item and flag it: the check is broken, bypassed or too narrow.

## 2. Group and count

Cluster corrections that describe the same rule, even when they're worded differently. For each cluster, record how many times it appears, in how many PRs, and two or three example links.

## 3. Rank

Rank the clusters by:

- **frequency:** how often it recurs;
- **cost:** reverts and incidents count more than performance problems, which count more than style;
- **encodability:** whether a deterministic check could catch it. The control list in `encode-correction` shows the options.

Frequent, costly and checkable goes to the top. Frequent but needing judgment goes in the "still needs review" list.

## Report

Show the top five by default:

```
## Corrections harvest: [date range]
Sources: [n] review comments, [n] reverts, [n] rules-file changes

### Encode next
1. [wrong → right]: [count] times in [n] PRs (e.g. [links]). Suggested control: [type].

### Checks that should have caught something
- [check]: [what slipped through]

### What review still catches (not encodable yet)
- [category]: [count], e.g. [example]

### Compared with the last harvest
[trend, if a previous report exists]
```

Then offer to run `encode-correction` on the top item. If the user wants to track trends, save the report somewhere they choose (for example `docs/harvest/YYYY-MM-DD.md`) so the next run can compare against it.
